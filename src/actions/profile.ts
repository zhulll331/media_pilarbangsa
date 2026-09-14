'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: { fullName: string; bio?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName.trim(),
      bio: data.bio ? data.bio.trim() : null,
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/author');
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'File tidak ditemukan.' };
  }

  // Cek ukuran max 2MB
  if (file.size > 2 * 1024 * 1024) {
    return { error: 'Ukuran foto melebihi batas maksimal 2MB.' };
  }

  const fileExt = file.name.split('.').pop() || 'png';
  const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  revalidatePath('/author');
  return { success: true, avatarUrl: publicUrl };
}

export async function uploadCoverImage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Harap masuk terlebih dahulu.' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'File tidak ditemukan.' };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: 'Ukuran cover melebihi batas maksimal 2MB.' };
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${Date.now()}-cover.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('post-covers')
    .upload(filePath, file, {
      upsert: true,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('post-covers')
    .getPublicUrl(filePath);

  return { success: true, publicUrl };
}
