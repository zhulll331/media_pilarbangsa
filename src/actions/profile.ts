'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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

  const adminClient = createAdminClient();
  const { error: uploadError } = await adminClient.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || 'image/png',
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = adminClient.storage
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

  const adminClient = createAdminClient();
  const { error: uploadError } = await adminClient.storage
    .from('post-covers')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = adminClient.storage
    .from('post-covers')
    .getPublicUrl(filePath);

  return { success: true, publicUrl };
}
