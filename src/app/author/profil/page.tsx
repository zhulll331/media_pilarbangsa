"use client";

import React, { useState, useEffect } from "react";
import { usePortal } from "@/context/portal-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateProfile, uploadAvatar } from "@/actions/profile";
import { Save, Upload, Loader2 } from "lucide-react";

export default function AuthorProfileSettingsPage() {
  const { user, profile, showToast } = usePortal();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Gagal: Ukuran foto melebihi 2MB.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadAvatar(formData);
      if (res.success && res.avatarUrl) {
        setAvatarUrl(res.avatarUrl);
        showToast("Foto profil berhasil diperbarui!", "success");
        return;
      }
    } catch {
      // Fallback
    }

    const preview = URL.createObjectURL(file);
    setAvatarUrl(preview);
    showToast("Foto profil berhasil dipilih!", "success");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateProfile({ fullName: name, bio });
      if (res?.error) {
        showToast(res.error, "error");
      } else {
        showToast("Profil penulis berhasil diperbarui!", "success");
      }
    } catch (err: any) {
      showToast(err.message || "Gagal memperbarui profil.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
          Profil Penulis
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
          Informasi ini ditampilkan di kotak bio artikel dan halaman profil publik Anda
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-5 pb-6 border-b border-[#E5E7EB]">
            <Avatar
              src={avatarUrl}
              name={name || user?.email || "Penulis"}
              size="xl"
              className="w-20 h-20 border-2 border-gray-200"
            />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#111827] block mb-1">
                Foto Profil
              </span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#005AE0] hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto Baru</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-[#6B7280] block mt-1">
                Format JPG/PNG, maksimal 2MB
              </span>
            </div>
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Nama Lengkap & Pena
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Alamat Email (Akun)
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-2.5 bg-gray-100 text-xs sm:text-sm text-gray-500 rounded-xl border border-[#E5E7EB] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">
              Biografi Singkat (1-2 Paragraf)
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] leading-relaxed rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
              placeholder="Ceritakan latar belakang, fokus minat penulisan, atau jurusan Anda..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan Perubahan Profil</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
