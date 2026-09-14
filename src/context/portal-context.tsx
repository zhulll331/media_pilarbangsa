'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Post,
  Comment,
  Category,
  Tag,
  MOCK_USERS,
  MOCK_CATEGORIES,
  MOCK_TAGS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
} from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import {
  createDraft,
  updateDraft,
  submitForReview as submitPostForReview,
  approvePost as approvePostAction,
  rejectPost as rejectPostAction,
  deletePost as deletePostAction,
} from '@/actions/posts';
import {
  addComment as addCommentAction,
  hideComment as hideCommentAction,
  deleteComment as deleteCommentAction,
} from '@/actions/comments';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface PortalContextType {
  currentRole: 'guest' | 'author' | 'admin';
  currentUser: User | null;
  setRole: (role: 'guest' | 'author' | 'admin') => void;
  signOut: () => Promise<void>;
  posts: Post[];
  categories: Category[];
  tags: Tag[];
  comments: Comment[];
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  // Post actions
  saveDraft: (post: Partial<Post>) => Promise<string>;
  submitForReview: (post: Partial<Post>) => Promise<string>;
  approvePost: (postId: string) => Promise<void>;
  rejectPost: (postId: string, note: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getPostBySlug: (slug: string) => Post | undefined;
  // Comment actions
  addComment: (postId: string, content: string, parentId?: string) => Promise<boolean>;
  moderateComment: (commentId: string, status: 'visible' | 'hidden' | 'flagged') => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<'guest' | 'author' | 'admin'>('guest');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // 1. Toast Notification Helpers
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Supabase Auth State Synchronization
  useEffect(() => {
    const supabase = createClient();

    const fetchUserProfile = async (userId: string, email?: string) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profile) {
          const role = (profile.role === 'admin' ? 'admin' : 'author') as 'admin' | 'author';
          const userObj: User = {
            id: profile.id,
            name: profile.full_name || email?.split('@')[0] || 'Penulis UNTAG',
            email: email || '',
            role: role,
            avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            bio: profile.bio || 'Penulis Media Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa',
            joinedAt: profile.created_at || new Date().toISOString(),
          };
          setCurrentUser(userObj);
          setCurrentRole(role);
          return;
        }
      } catch (err) {
        console.warn('Gagal memuat profil Supabase:', err);
      }

      // Default jika profil belum terbuat di DB
      if (email) {
        const role = email === 'ukmpilarbangsa@gmail.com' ? 'admin' : 'author';
        setCurrentUser({
          id: userId,
          name: email.split('@')[0],
          email,
          role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          joinedAt: new Date().toISOString(),
        });
        setCurrentRole(role);
      }
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setCurrentRole('guest');
      }
    });

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email);
      } else {
        setCurrentUser(null);
        setCurrentRole('guest');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 3. Sinkronisasi Data Live dari Supabase (dengan graceful fallback)
  useEffect(() => {
    const loadLiveData = async () => {
      try {
        const supabase = createClient();
        const { data: dbPosts, error: postErr } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            status,
            published_at,
            created_at,
            updated_at,
            view_count,
            rejection_note,
            author_id,
            author:profiles(id, full_name, avatar_url, role),
            category_id,
            category:categories(id, name, slug, description)
          `)
          .order('created_at', { ascending: false });

        if (!postErr && dbPosts && dbPosts.length > 0) {
          const mapped: Post[] = dbPosts.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || '',
            content: p.content || '',
            coverImage: p.cover_image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
            authorId: p.author_id,
            author: {
              id: p.author?.id || p.author_id,
              name: p.author?.full_name || 'Penulis UNTAG',
              email: '',
              role: p.author?.role || 'author',
              avatar: p.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              joinedAt: p.created_at,
            },
            categoryId: p.category_id,
            category: p.category || MOCK_CATEGORIES[0],
            tags: MOCK_TAGS.slice(0, 2),
            status: p.status === 'pending_review' ? 'pending' : p.status,
            publishedAt: p.published_at,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            viewCount: p.view_count || 0,
            readTime: '4 menit baca',
            rejectionNote: p.rejection_note,
          }));
          setPosts(mapped);
        }

        // Kategori dari database
        const { data: dbCategories } = await supabase.from('categories').select('*');
        if (dbCategories && dbCategories.length > 0) {
          setCategories(
            dbCategories.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              count: 0,
            }))
          );
        }

        // Tags dari database
        const { data: dbTags } = await supabase.from('tags').select('*');
        if (dbTags && dbTags.length > 0) {
          setTags(
            dbTags.map((t: any) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              count: 0,
            }))
          );
        }
      } catch {
        // Jika database belum dimigrasikan, gunakan in-memory data
      }
    };

    loadLiveData();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentRole('guest');
    showToast('Anda telah keluar dari sistem.', 'info');
  };

  const setRole = (role: 'guest' | 'author' | 'admin') => {
    setCurrentRole(role);
    if (role === 'admin') {
      setCurrentUser(MOCK_USERS[0]);
      showToast('Beralih ke peran Admin (Siti Rahma - Pemred)', 'info');
    } else if (role === 'author') {
      setCurrentUser(MOCK_USERS[1]);
      showToast('Beralih ke peran Penulis Mahasiswa (Budi Santoso)', 'info');
    } else {
      setCurrentUser(null);
      showToast('Beralih ke mode Pembaca Publik / Tamu', 'info');
    }
  };

  // 4. Post Actions (Server Actions + Local Fallback State)
  const saveDraft = async (data: Partial<Post>): Promise<string> => {
    const user = currentUser || MOCK_USERS[1];
    const newId = data.id || 'post-' + Date.now();

    // Jalankan Server Action
    try {
      if (data.id && !data.id.startsWith('post-')) {
        await updateDraft(data.id, {
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          categoryId: data.categoryId,
          coverImage: data.coverImage,
        });
      } else if (data.title && data.content) {
        await createDraft({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          categoryId: data.categoryId,
          coverImage: data.coverImage,
        });
      }
    } catch (e) {
      console.warn('Server Action createDraft:', e);
    }

    // Local UI update
    const category = categories.find((c) => c.id === data.categoryId) || categories[0];
    const newPost: Post = {
      id: newId,
      title: data.title || 'Tanpa Judul',
      slug: data.slug || (data.title || 'draft-naskah').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      authorId: user.id,
      author: user,
      categoryId: category.id,
      category,
      tags: data.tags && data.tags.length ? data.tags : [tags[0]],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      readTime: '3 menit baca',
    };

    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newId);
      if (exists) {
        return prev.map((p) => (p.id === newId ? { ...p, ...newPost, updatedAt: new Date().toISOString() } : p));
      }
      return [newPost, ...prev];
    });

    showToast('Draf naskah berhasil disimpan!', 'success');
    return newId;
  };

  const submitForReview = async (data: Partial<Post>): Promise<string> => {
    const user = currentUser || MOCK_USERS[1];
    const newId = data.id || 'post-' + Date.now();

    try {
      if (data.id && !data.id.startsWith('post-')) {
        await submitPostForReview(data.id);
      }
    } catch (e) {
      console.warn('Server Action submitForReview:', e);
    }

    const category = categories.find((c) => c.id === data.categoryId) || categories[0];
    const newPost: Post = {
      id: newId,
      title: data.title || 'Naskah Baru',
      slug: data.slug || (data.title || 'naskah-baru').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      authorId: user.id,
      author: user,
      categoryId: category.id,
      category,
      tags: data.tags && data.tags.length ? data.tags : [tags[0]],
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      readTime: '4 menit baca',
    };

    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newId);
      if (exists) {
        return prev.map((p) => (p.id === newId ? { ...p, ...newPost, status: 'pending' } : p));
      }
      return [newPost, ...prev];
    });

    showToast('Naskah berhasil diajukan ke Dewan Redaksi untuk ditinjau!', 'success');
    return newId;
  };

  const approvePost = async (postId: string) => {
    try {
      if (!postId.startsWith('post-')) {
        await approvePostAction(postId);
      }
    } catch (e) {
      console.warn('Server Action approvePost:', e);
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: 'published',
              publishedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    showToast('Naskah telah disetujui & langsung tayang di portal!', 'success');
  };

  const rejectPost = async (postId: string, note: string) => {
    try {
      if (!postId.startsWith('post-')) {
        await rejectPostAction(postId, note);
      }
    } catch (e) {
      console.warn('Server Action rejectPost:', e);
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: 'rejected',
              rejectionNote: note,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    showToast('Naskah ditolak dengan catatan revisi untuk penulis.', 'warning');
  };

  const deletePost = async (postId: string) => {
    try {
      if (!postId.startsWith('post-')) {
        await deletePostAction(postId);
      }
    } catch (e) {
      console.warn('Server Action deletePost:', e);
    }

    setPosts((prev) => prev.filter((p) => p.id !== postId));
    showToast('Naskah telah dihapus dari sistem.', 'info');
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((p) => p.slug === slug);
  };

  // 5. Comment Actions
  const addComment = async (postId: string, content: string, parentId?: string): Promise<boolean> => {
    const user = currentUser || {
      id: 'user-guest-' + Date.now(),
      name: 'Pembaca Kampus',
      email: 'guest@untag-bwi.ac.id',
      role: 'reader' as const,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinedAt: new Date().toISOString(),
    };

    try {
      if (!postId.startsWith('post-')) {
        const res = await addCommentAction(postId, content, parentId);
        if (res.error) {
          showToast(res.error, 'error');
          return false;
        }
      }
    } catch (e) {
      console.warn('Server Action addComment:', e);
    }

    const newComment: Comment = {
      id: 'comm-' + Date.now(),
      postId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
      status: 'visible',
      parentId: parentId || null,
      replies: [],
    };

    if (parentId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        })
      );
    } else {
      setComments((prev) => [newComment, ...prev]);
    }

    showToast('Komentar Anda berhasil dipublikasikan!', 'success');
    return true;
  };

  const moderateComment = async (commentId: string, status: 'visible' | 'hidden' | 'flagged') => {
    try {
      if (status === 'hidden') {
        await hideCommentAction(commentId);
      }
    } catch (e) {
      console.warn('Server Action hideComment:', e);
    }

    const updateStatus = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id === commentId) {
          return { ...c, status };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: updateStatus(c.replies) };
        }
        return c;
      });

    setComments((prev) => updateStatus(prev));
    showToast(`Status komentar diubah menjadi: ${status}`, 'info');
  };

  const deleteComment = async (commentId: string) => {
    try {
      await deleteCommentAction(commentId);
    } catch (e) {
      console.warn('Server Action deleteComment:', e);
    }

    const removeComment = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies ? removeComment(c.replies) : [],
        }));

    setComments((prev) => removeComment(prev));
    showToast('Komentar telah dihapus.', 'warning');
  };

  return (
    <PortalContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        signOut,
        posts,
        categories,
        tags,
        comments,
        toasts,
        showToast,
        dismissToast,
        saveDraft,
        submitForReview,
        approvePost,
        rejectPost,
        deletePost,
        getPostBySlug,
        addComment,
        moderateComment,
        deleteComment,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}
