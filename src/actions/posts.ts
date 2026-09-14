'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import DOMPurify from 'isomorphic-dompurify';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import {
  sendNewSubmissionEmailToAdmin,
  sendPostApprovedEmailToAuthor,
  sendPostRejectedEmailToAuthor,
} from '@/lib/email/templates';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li',
    'blockquote', 'a', 'img', 'br', 'hr', 'code', 'pre', 'span'
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class', 'width', 'height'],
};

export async function createDraft(data: {
  title: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  coverImage?: string;
  tagIds?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' };
  }

  const cleanContent = DOMPurify.sanitize(data.content || '', SANITIZE_CONFIG);
  const baseSlug = slugify(data.title || 'draft');
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      slug: uniqueSlug,
      excerpt: data.excerpt || data.title,
      content: cleanContent,
      category_id: data.categoryId || null,
      cover_image_url: data.coverImage || null,
      author_id: user.id,
      status: 'draft',
    })
    .select()
    .single();

  if (error || !post) {
    console.error('Error createDraft:', error);
    return { error: error?.message || 'Gagal menyimpan draf.' };
  }

  // Tags
  if (data.tagIds && data.tagIds.length > 0) {
    const postTags = data.tagIds.map((tagId) => ({
      post_id: post.id,
      tag_id: tagId,
    }));
    await supabase.from('post_tags').insert(postTags);
  }

  revalidatePath('/author');
  revalidatePath('/author/tulisan');

  return { success: true, post };
}

export async function updateDraft(
  postId: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    categoryId?: string;
    coverImage?: string;
    tagIds?: string[];
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' };
  }

  // Cek apakah post ada dan milik user serta berstatus draft / rejected
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id, author_id, status')
    .eq('id', postId)
    .single();

  if (!existingPost) {
    return { error: 'Naskah tidak ditemukan.' };
  }

  if (existingPost.author_id !== user.id) {
    return { error: 'Anda tidak memiliki hak untuk mengedit naskah ini.' };
  }

  if (existingPost.status !== 'draft' && existingPost.status !== 'rejected') {
    return { error: 'Naskah yang sedang ditinjau atau sudah terbit tidak dapat diedit.' };
  }

  const updatePayload: Record<string, any> = {};
  if (data.title !== undefined) {
    updatePayload.title = data.title;
  }
  if (data.excerpt !== undefined) {
    updatePayload.excerpt = data.excerpt;
  }
  if (data.content !== undefined) {
    updatePayload.content = DOMPurify.sanitize(data.content, SANITIZE_CONFIG);
  }
  if (data.categoryId !== undefined) {
    updatePayload.category_id = data.categoryId;
  }
  if (data.coverImage !== undefined) {
    updatePayload.cover_image_url = data.coverImage;
  }

  const { error } = await supabase
    .from('posts')
    .update(updatePayload)
    .eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  // Update tags jika disertakan
  if (data.tagIds !== undefined) {
    await supabase.from('post_tags').delete().eq('post_id', postId);
    if (data.tagIds.length > 0) {
      const postTags = data.tagIds.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      }));
      await supabase.from('post_tags').insert(postTags);
    }
  }

  revalidatePath('/author');
  revalidatePath('/author/tulisan');

  return { success: true };
}

export async function submitForReview(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus masuk terlebih dahulu.' };
  }

  // Ambil post beserta nama penulis & kategori
  const { data: post, error: fetchErr } = await supabase
    .from('posts')
    .select('id, title, author_id, status, category:categories(name)')
    .eq('id', postId)
    .single();

  if (fetchErr || !post) {
    return { error: 'Naskah tidak ditemukan.' };
  }

  if (post.author_id !== user.id) {
    return { error: 'Akses ditolak.' };
  }

  const oldStatus = post.status;

  const { error: updateErr } = await supabase
    .from('posts')
    .update({ status: 'pending_review' })
    .eq('id', postId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  // Audit status history
  await supabase.from('post_status_history').insert({
    post_id: postId,
    old_status: oldStatus,
    new_status: 'pending_review',
    changed_by: user.id,
    note: 'Diajukan oleh penulis untuk kurasi redaksi',
  });

  // Ambil profil penulis untuk notifikasi email
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const authorName = profile?.full_name || user.email || 'Penulis Mahasiswa';
  const categoryName = (post.category as any)?.name;

  // Kirim email notifikasi ke redaksi
  await sendNewSubmissionEmailToAdmin({
    postTitle: post.title,
    authorName,
    categoryName,
    postId,
  });

  revalidatePath('/author');
  revalidatePath('/author/tulisan');
  revalidatePath('/admin');

  return { success: true };
}

export async function approvePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  // Verifikasi role admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Redaksi yang berwenang menyetujui naskah.' };
  }

  const adminClient = createAdminClient();

  // Dapatkan post dan data author
  const { data: post, error: fetchErr } = await adminClient
    .from('posts')
    .select('id, title, slug, status, author_id')
    .eq('id', postId)
    .single();

  if (fetchErr || !post) {
    return { error: 'Naskah tidak ditemukan.' };
  }

  const { error: updateErr } = await adminClient
    .from('posts')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      rejection_note: null,
    })
    .eq('id', postId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  // Record audit history
  await adminClient.from('post_status_history').insert({
    post_id: postId,
    old_status: post.status,
    new_status: 'published',
    changed_by: user.id,
    note: 'Naskah disetujui dan diterbitkan oleh Redaksi',
  });

  // Kirim email ke penulis jika ada auth user info
  if (post.author_id) {
    const { data: authorUser } = await adminClient.auth.admin.getUserById(post.author_id);
    const { data: authorProfile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', post.author_id)
      .single();

    if (authorUser?.user?.email) {
      await sendPostApprovedEmailToAuthor({
        authorEmail: authorUser.user.email,
        authorName: authorProfile?.full_name || 'Penulis',
        postTitle: post.title,
        postSlug: post.slug,
      });
    }
  }

  revalidatePath('/');
  revalidatePath('/artikel');
  revalidatePath(`/artikel/${post.slug}`);
  revalidatePath('/admin');
  revalidatePath('/author/tulisan');

  return { success: true };
}

export async function rejectPost(postId: string, note: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Redaksi yang berwenang menolak atau meminta revisi naskah.' };
  }

  if (!note || !note.trim()) {
    return { error: 'Catatan perbaikan wajib diisi agar penulis dapat merevisi.' };
  }

  const adminClient = createAdminClient();

  const { data: post, error: fetchErr } = await adminClient
    .from('posts')
    .select('id, title, status, author_id')
    .eq('id', postId)
    .single();

  if (fetchErr || !post) {
    return { error: 'Naskah tidak ditemukan.' };
  }

  const { error: updateErr } = await adminClient
    .from('posts')
    .update({
      status: 'rejected',
      rejection_note: note.trim(),
    })
    .eq('id', postId);

  if (updateErr) {
    return { error: updateErr.message };
  }

  // Audit history
  await adminClient.from('post_status_history').insert({
    post_id: postId,
    old_status: post.status,
    new_status: 'rejected',
    changed_by: user.id,
    note: `Perlu revisi: ${note.trim()}`,
  });

  // Kirim email notifikasi ke penulis
  if (post.author_id) {
    const { data: authorUser } = await adminClient.auth.admin.getUserById(post.author_id);
    const { data: authorProfile } = await adminClient
      .from('profiles')
      .select('full_name')
      .eq('id', post.author_id)
      .single();

    if (authorUser?.user?.email) {
      await sendPostRejectedEmailToAuthor({
        authorEmail: authorUser.user.email,
        authorName: authorProfile?.full_name || 'Penulis',
        postTitle: post.title,
        postId: post.id,
        note: note.trim(),
      });
    }
  }

  revalidatePath('/admin');
  revalidatePath('/author/tulisan');

  return { success: true };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const adminClient = createAdminClient();

  const { data: post } = await adminClient
    .from('posts')
    .select('id, author_id, status')
    .eq('id', postId)
    .single();

  if (!post) {
    return { error: 'Naskah tidak ditemukan.' };
  }

  // Admin boleh hapus naskah apapun; Author hanya boleh hapus draft miliknya
  const isAllowed =
    profile?.role === 'admin' ||
    (post.author_id === user.id && post.status === 'draft');

  if (!isAllowed) {
    return { error: 'Anda tidak memiliki hak untuk menghapus naskah ini.' };
  }

  const { error } = await adminClient.from('posts').delete().eq('id', postId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/author/tulisan');

  return { success: true };
}

export async function incrementViewCount(postId: string) {
  try {
    const adminClient = createAdminClient();
    const { data: post } = await adminClient
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (post) {
      await adminClient
        .from('posts')
        .update({ view_count: (post.view_count || 0) + 1 })
        .eq('id', postId);
    }
  } catch (error) {
    console.warn('Gagal menambah view count:', error);
  }
}
