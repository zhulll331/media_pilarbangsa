'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function addComment(postId: string, content: string, parentId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Silakan masuk terlebih dahulu untuk menulis komentar.' };
  }

  const trimmed = (content || '').trim();
  if (!trimmed) {
    return { error: 'Komentar tidak boleh kosong.' };
  }

  // Rate Limiting: 60 detik antar komentar per user
  const { data: profile } = await supabase
    .from('profiles')
    .select('last_comment_at')
    .eq('id', user.id)
    .single();

  if (profile?.last_comment_at) {
    const lastCommentTime = new Date(profile.last_comment_at).getTime();
    const now = Date.now();
    const diffSeconds = Math.floor((now - lastCommentTime) / 1000);

    if (diffSeconds < 60) {
      const waitSeconds = 60 - diffSeconds;
      return {
        error: `Mohon tunggu ${waitSeconds} detik lagi sebelum mengirim komentar berikutnya.`,
      };
    }
  }

  const { data: newComment, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      parent_id: parentId || null,
      content: trimmed,
      status: 'visible',
    })
    .select('*, author:profiles(id, full_name, avatar_url)')
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update last_comment_at di profile
  await supabase
    .from('profiles')
    .update({ last_comment_at: new Date().toISOString() })
    .eq('id', user.id);

  revalidatePath('/artikel');
  return { success: true, comment: newComment };
}

export async function hideComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Akses ditolak.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Admin yang dapat memoderasi komentar.' };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('comments')
    .update({ status: 'hidden' })
    .eq('id', commentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/komentar');
  revalidatePath('/artikel');
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Akses ditolak.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Admin yang dapat menghapus komentar.' };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/komentar');
  revalidatePath('/artikel');
  return { success: true };
}
