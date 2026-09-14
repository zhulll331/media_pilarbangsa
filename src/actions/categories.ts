'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function createCategory(data: { name: string; description?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Akses ditolak.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Admin yang dapat mengelola kategori.' };
  }

  const slug = slugify(data.name);
  const adminClient = createAdminClient();

  const { data: category, error } = await adminClient
    .from('categories')
    .insert({
      name: data.name.trim(),
      slug,
      description: data.description ? data.description.trim() : null,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  return { success: true, category };
}

export async function updateCategory(id: string, data: { name: string; description?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Akses ditolak.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Admin yang dapat mengelola kategori.' };
  }

  const slug = slugify(data.name);
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('categories')
    .update({
      name: data.name.trim(),
      slug,
      description: data.description ? data.description.trim() : null,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Akses ditolak.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Hanya Admin yang dapat mengelola kategori.' };
  }

  const adminClient = createAdminClient();

  // Pastikan tidak ada post yang memakai kategori ini
  const { count } = await adminClient
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count && count > 0) {
    return { error: `Tidak dapat menghapus: terdapat ${count} naskah yang masih menggunakan kategori ini.` };
  }

  const { error } = await adminClient
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  return { success: true };
}

export async function createTag(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Akses ditolak.' };

  const slug = slugify(name);
  const adminClient = createAdminClient();

  const { data: tag, error } = await adminClient
    .from('tags')
    .insert({
      name: name.trim(),
      slug,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  return { success: true, tag };
}

export async function deleteTag(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Akses ditolak.' };

  const adminClient = createAdminClient();
  const { error } = await adminClient.from('tags').delete().eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/kategori');
  return { success: true };
}
