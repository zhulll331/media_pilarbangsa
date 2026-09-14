"use client";

import React, { useState } from "react";
import { usePortal } from "@/context/portal-context";
import { Button } from "@/components/ui/button";
import { TagChip } from "@/components/ui/tag-chip";
import { Layers, Hash, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminCategoryTagPage() {
  const { categories, tags, posts, showToast } = usePortal();

  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newTagName, setNewTagName] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    showToast(`Kategori "${newCatName}" berhasil ditambahkan!`, "success");
    setNewCatName("");
    setNewCatDesc("");
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    showToast(`Tagar "${newTagName.startsWith("#") ? newTagName : "#" + newTagName}" berhasil dibuat!`, "success");
    setNewTagName("");
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Categories (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-base font-bold text-[#111827] mb-4 flex items-center justify-between">
              <span>Rubrik Kategori Editorial ({categories.length})</span>
            </h2>

            <div className="divide-y divide-[#E5E7EB]">
              {categories.map((cat) => {
                const articleCount = posts.filter(
                  (p) => p.categoryId === cat.id
                ).length;

                return (
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
                      <p className="text-xs text-[#6B7280] line-clamp-1">
                        {cat.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-[#005AE0] bg-blue-50 px-2.5 py-1 rounded-full data-tabular">
                        {articleCount} Tulisan
                      </span>
                    </div>
                  </div>
                );
              })}
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
              <Button variant="primary" size="sm" type="submit">
                Simpan Kategori
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
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E5E7EB] bg-gray-50 text-xs font-medium text-[#111827]"
                >
                  <span>{tag.name}</span>
                  <span className="text-[10px] text-[#6B7280] data-tabular">
                    ({tag.count})
                  </span>
                </div>
              ))}
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
                placeholder="#beasiswa, #wisuda..."
                className="flex-1 p-2.5 bg-[#F0F4F8] text-xs sm:text-sm text-[#111827] rounded-xl border border-[#E5E7EB] focus:border-[#005AE0] focus:bg-white focus:outline-none transition-all"
                required
              />
              <Button variant="primary" size="sm" type="submit">
                Tambah
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
