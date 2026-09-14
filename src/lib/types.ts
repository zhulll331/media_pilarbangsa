/**
 * Shared domain types — sumber kebenaran satu-satunya.
 * Tidak ada data dummy di sini; hanya definisi shape/interface.
 */

export interface UserProfile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'author' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface PostAuthor {
  id: string;
  name: string;
  avatar: string | null;
  email?: string;
  role?: string;
  bio?: string | null;
  joinedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  author: PostAuthor;
  categoryId: string;
  category: Category;
  tags: Tag[];
  status: 'draft' | 'pending' | 'published' | 'rejected';
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  readTime?: string;
  rejectionNote?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;
  content: string;
  createdAt: string;
  status: 'visible' | 'hidden';
  parentId?: string | null;
  replies?: Comment[];
}
