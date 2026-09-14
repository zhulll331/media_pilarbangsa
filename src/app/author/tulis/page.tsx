"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  Upload,
  Loader2,
} from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { uploadCoverImage } from "@/actions/profile";
import { createDraft, updateDraft, submitForReview } from "@/actions/posts";
import type { Category, Tag } from "@/lib/types";

function AuthorEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("id");

  const { showToast } = usePortal();

  const [currentPostId, setCurrentPostId] = useState<string | null>(postIdParam);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"
  );
  const [lastSaved, setLastSaved] = useState<string>("Belum disimpan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const isLoadedRef = useRef(false);

  // Load Categories & Tags
  useEffect(() => {
    const fetchTaxonomies = async () => {
      const supabase = createClient();
      const [catRes, tagRes] = await Promise.all([
        supabase.from("categories").select("id, name, slug").order("name"),
        supabase.from("tags").select("id, name, slug").order("name"),
      ]);

      if (catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data as Category[]);
        setCategoryId((prev) => prev || catRes.data[0].id);
      }
      if (tagRes.data) {
        setTags(tagRes.data as Tag[]);
      }
    };
    fetchTaxonomies();
  }, []);

  // Load existing post if editing
  useEffect(() => {
    if (!postIdParam) {
      isLoadedRef.current = true;
      return;
    }
    const fetchPost = async () => {
      setIsLoadingPost(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, title, excerpt, content, cover_image_url, category_id,
          post_tags(tag_id)
        `)
        .eq("id", postIdParam)
        .single();

      if (!error && data) {
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        if (data.cover_image_url) setCoverImage(data.cover_image_url);
        if (data.category_id) setCategoryId(data.category_id);
        if (data.post_tags) {
          setSelectedTags(data.post_tags.map((pt: any) => pt.tag_id));
        }
        setLastSaved("Tersimpan di sistem");
      }
      setIsLoadingPost(false);
      isLoadedRef.current = true;
    };
    fetchPost();
  }, [postIdParam]);

  // Upload Cover Image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB limit
    if (file.size > maxSize) {
      showToast("Gagal: Ukuran gambar melebihi batas maksimal 2MB.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadCoverImage(formData);
      if (res.success && res.publicUrl) {
        setCoverImage(res.publicUrl);
        showToast("Gambar sampul berhasil diunggah!", "success");
        return;
      }
    } catch {
      // Fallback
    }

    const objectUrl = URL.createObjectURL(file);
    setCoverImage(objectUrl);
    showToast("Gambar sampul dipilih.", "success");
  };

  // Manual Save Draft Function
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showToast("Mohon masukkan judul naskah sebelum menyimpan draf.", "warning");
      return;
    }

    setIsSaving(true);
    try {
      if (currentPostId) {
        const res = await updateDraft(currentPostId, {
          title,
          excerpt,
          content,
          categoryId: categoryId || undefined,
          coverImage,
          tagIds: selectedTags,
        });

        if (res?.error) {
          showToast(res.error, "error");
          return;
        }

        const timeStr = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setLastSaved(`Tersimpan pukul ${timeStr}`);
        showToast("Draf berhasil diperbarui!", "success");
      } else {
        const res = await createDraft({
          title,
          excerpt,
          content,
          categoryId: categoryId || undefined,
          coverImage,
          tagIds: selectedTags,
        });

        if (res?.error) {
          showToast(res.error, "error");
          return;
        } else if (res?.post) {
          setCurrentPostId(res.post.id);
          window.history.replaceState(null, "", `/author/tulis?id=${res.post.id}`);
          const timeStr = new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastSaved(`Tersimpan pukul ${timeStr}`);
          showToast("Draf berhasil dibuat!", "success");
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Gagal menyimpan draf.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!title.trim()) {
      showToast("Mohon isi judul naskah.", "warning");
      return;
    }
    if (!content.trim()) {
      showToast("Mohon isi konten naskah sebelum mengajukan kurasi.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      let targetPostId = currentPostId;

      if (!targetPostId) {
        const createRes = await createDraft({
          title,
          excerpt: excerpt || title,
          content,
          categoryId: categoryId || undefined,
          coverImage,
          tagIds: selectedTags,
        });
        if (createRes?.error || !createRes?.post) {
          showToast(createRes?.error || "Gagal membuat draf.", "error");
          setIsSubmitting(false);
          return;
        }
        targetPostId = createRes.post.id;
        setCurrentPostId(targetPostId);
      } else {
        await updateDraft(targetPostId, {
          title,
          excerpt: excerpt || title,
          content,
          categoryId: categoryId || undefined,
          coverImage,
          tagIds: selectedTags,
        });
      }

      if (!targetPostId) {
        showToast("ID Naskah tidak valid.", "error");
        setIsSubmitting(false);
        return;
      }

      const submitRes = await submitForReview(targetPostId);
      if (submitRes?.error) {
        showToast(submitRes.error, "error");
        setIsSubmitting(false);
      } else {
        showToast("Naskah berhasil diajukan untuk ditinjau redaksi!", "success");
        setTimeout(() => {
          router.push("/author/tulisan");
        }, 500);
      }
    } catch (err: any) {
      showToast(err?.message || "Gagal mengajukan naskah.", "error");
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/author/tulisan"
            className="p-2 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
            title="Kembali ke Tulisan Saya"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#111827]">
              Studio Penulisan Naskah
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              {isSaving ? (
                <span className="flex items-center gap-1.5 text-[#005AE0] font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan draf...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[#059669] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lastSaved}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons: Simpan Draft + Kirim ke Editor */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSaving || isSubmitting}
            className="gap-1.5"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Draf</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitForReview}
            disabled={isSubmitting || isSaving}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Kirim ke Editor</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Main Writing Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Article Title Input */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                Judul Naskah / Artikel
              </label>
              <span className="text-[10px] text-gray-400">
                {title.length} karakter
              </span>
            </div>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ketik Judul Naskah yang Menarik dan Berbobot..."
              rows={2}
              className="w-full text-xl sm:text-2xl font-bold text-[#111827] placeholder:text-gray-300 border-none outline-none resize-none leading-snug"
            />
          </div>

          {/* TipTap WYSIWYG Rich Text Editor */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Mulai tuliskan naskah lengkap Anda di sini... Paragraf pertama akan otomatis diberi gaya editorial Drop Cap saat tayang di portal publik."
            onImageLimitError={(msg) => showToast(msg, "error")}
          />
        </div>

        {/* Right: Metadata, Cover, & Settings (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Cover Image Box */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#111827] block">
              Foto Sampul Artikel
            </span>

            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100 border border-[#E5E7EB]">
              <img
                src={coverImage}
                alt="Pratinjau Sampul"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-[#E5E7EB] hover:border-[#005AE0] rounded-xl text-xs font-semibold text-[#005AE0] bg-[#F0F4F8] hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Ganti Gambar (Maks 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              <span className="text-[10px] text-[#6B7280] block text-center mt-1.5">
                Batas 2MB sesuai ketentuan untuk performa optimal.
              </span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] block">
              Rubrik / Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 bg-[#F0F4F8] text-xs font-semibold text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt Input */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                Ringkasan / Excerpt
              </label>
              <span className="text-[10px] text-[#6B7280]">SEO & Preview</span>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tuliskan 1-2 kalimat ringkasan inti tulisan untuk pratinjau kartu..."
              rows={3}
              className="w-full p-2.5 text-xs bg-[#F0F4F8] text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
            />
          </div>

          {/* Tag Chips Picker */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#111827] block">
              Pilih Tagar (Topik Bebas)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-[#005AE0] text-white border-[#005AE0]"
                        : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#005AE0]"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthorEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
        </div>
      }
    >
      <AuthorEditorContent />
    </Suspense>
  );
}
