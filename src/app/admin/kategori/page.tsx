"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePortal } from "@/context/portal-context";
import {
  createCategory,
  deleteCategory,
  createTag,
  deleteTag,
} from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Layers, Hash, Plus, Trash2, Loader2 } from "lucide-react";

interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount?: number;
}

interface AdminTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export default function AdminCategoryTagPage() {
  const { showToast } = usePortal();

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const [catRes, postRes, tagRes, postTagRes] = await Promise.all([
      supabase.from("categories").select("id, name, slug, description").order("name"),
      supabase.from("posts").select("category_id"),
      supabase.from("tags").select("id, name, slug").order("name"),
      supabase.from("post_tags").select("tag_id"),
    ]);

    if (catRes.data) {
      const posts = postRes.data || [];
      const catsWithCount = catRes.data.map((c: any) => ({
        ...c,
        postCount: posts.filter((p: any) => p.category_id === c.id).length,
      }));
      setCategories(catsWithCount);
    }

    if (tagRes.data) {
      const postTags = postTagRes.data || [];
      const tagsWithCount = tagRes.data.map((t: any) => ({
        ...t,
        count: postTags.filter((pt: any) => pt.tag_id === t.id).length,
      }));
      setTags(tagsWithCount);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmittingCat(true);
    const res = await createCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim() || undefined,
    });
    setIsSubmittingCat(false);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast(`Kategori "${newCatName}" berhasil ditambahkan!`, "success");
      setNewCatName("");
      setNewCatDesc("");
      fetchData();
    }
  };

  const handleDeleteCategory = async (cat: AdminCategory) => {
    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;

    const res = await deleteCategory(cat.id);
    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast(`Kategori "${cat.name}" berhasil dihapus.`, "success");
      fetchData();
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setIsSubmittingTag(true);
    const res = await createTag(newTagName.trim());
    setIsSubmittingTag(false);

    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast(`Tagar "${newTagName}" berhasil dibuat!`, "success");
      setNewTagName("");
      fetchData();
    }
  };

  const handleDeleteTag = async (tag: AdminTag) => {
    if (!confirm(`Hapus tagar "${tag.name}"?`)) return;

    const res = await deleteTag(tag.id);
    if (res?.error) {
      showToast(res.error, "error");
    } else {
      showToast(`Tagar "${tag.name}" berhasil dihapus.`, "success");
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-100 text-[#005AE0]">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#005AE0]">
              Struktur Taksonomi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            Manajemen Rubrik Kategori & Tagar
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Atur rubrik editorial kurasi (Solid Badge) dan tagar metadata bebas (Outline Chip)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#005AE0]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Categories (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <h2 className="text-base font-bold text-[#111827] mb-4 flex items-center justify-between">
                <span>Rubrik Kategori Editorial ({categories.length})</span>
              </h2>

              <div className="divide-y divide-[#E5E7EB]">
                {categories.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#6B7280]">
                    Belum ada kategori terdaftar.
                  </p>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm text-[#111827]">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-[#6B7280] bg-gray-100 px-2 py-0.2 rounded-full font-medium">
                            /{cat.slug}
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-[#6B7280] line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-semibold text-[#005AE0] bg-blue-50 px-2.5 py-1 rounded-full data-tabular">
                          {cat.postCount || 0} Tulisan
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#005AE0]" />
                <span>Tambah Rubrik Kategori Baru</span>
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nama Kategori (misal: Investigasi)"
                    className="w-full p-2.5 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="Deskripsi singkat rubrik editorial..."
                    className="w-full p-2.5 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmittingCat}
                >
                  {isSubmittingCat ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Simpan Kategori"
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Tags (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <h2 className="text-base font-bold text-[#111827] mb-3 flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#005AE0]" />
                <span>Daftar Tagar Bebas ({tags.length})</span>
              </h2>
              <p className="text-xs text-[#6B7280] mb-4">
                Tagar dibuat oleh penulis untuk mengelompokkan topik secara fleksibel.
              </p>

              <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                  <p className="text-xs text-[#6B7280]">Belum ada tagar terdaftar.</p>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E5E7EB] bg-gray-50 text-xs font-medium text-[#111827] group"
                    >
                      <span>{tag.name}</span>
                      <span className="text-[10px] text-[#6B7280] data-tabular">
                        ({tag.count || 0})
                      </span>
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        className="text-gray-300 hover:text-red-500 ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Hapus Tagar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Add Tag Form */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#005AE0]" />
                <span>Buat Tagar Baru</span>
              </h3>
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="beasiswa, wisuda..."
                  className="flex-1 p-2.5 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
                  required
                />
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmittingTag}
                >
                  {isSubmittingTag ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Tambah"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
