"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { compressImage } from "@/lib/image-compression";
import { uploadEditorImage } from "@/actions/profile";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageLimitError?: (msg: string) => void;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Mulai tuliskan naskah lengkap Anda di sini... Paragraf pertama akan otomatis diberi gaya editorial Drop Cap saat tayang di portal publik.",
  onImageLimitError,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const processAndInsertImage = async (file: File) => {
    if (!editor) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    setIsUploadingImage(true);
    try {
      // Otomatis kompresi gambar di browser: downscale max 1200px, WebP quality 0.8 (hemat ~90% storage)
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        quality: 0.8,
        targetMimeType: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", compressedFile);

      const res = await uploadEditorImage(formData);
      if (res?.success && res.publicUrl) {
        editor
          .chain()
          .focus()
          .setImage({ src: res.publicUrl, alt: file.name.replace(/\.[^/.]+$/, "") })
          .run();
      } else {
        const errorMsg = res?.error || "Gagal mengunggah gambar ke penyimpanan.";
        if (onImageLimitError) {
          onImageLimitError(errorMsg);
        } else {
          alert(errorMsg);
        }
      }
    } catch (err: any) {
      console.error("Gagal mengompres & mengunggah gambar editor:", err);
      const errorMsg = "Terjadi kesalahan saat memproses kompresi gambar.";
      if (onImageLimitError) {
        onImageLimitError(errorMsg);
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            class: "text-[#005AE0] underline font-medium",
          },
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-xl max-w-full my-4 border border-gray-200 shadow-xs",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap ProseMirror p-5 sm:p-7 focus:outline-none min-h-[420px]",
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const imageFile = Array.from(files).find((f) => f.type.startsWith("image/"));
          if (imageFile) {
            event.preventDefault();
            processAndInsertImage(imageFile);
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const imageFile = Array.from(files).find((f) => f.type.startsWith("image/"));
          if (imageFile) {
            event.preventDefault();
            processAndInsertImage(imageFile);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Calculate live stats from TipTap text
  const plainText = editor ? editor.getText() : "";
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const charCount = plainText.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  const handleLink = () => {
    if (!editor) return;

    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL tautan:", previousUrl || "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    processAndInsertImage(file);
    e.target.value = "";
  };

  if (!isMounted || !editor) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-6 min-h-[460px] animate-pulse">
        <div className="h-10 bg-gray-100 rounded-xl mb-6 w-full" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded-sm w-3/4" />
          <div className="h-4 bg-gray-100 rounded-sm w-full" />
          <div className="h-4 bg-gray-100 rounded-sm w-5/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs">
      {/* WYSIWYG Formatting Toolbar */}
      <div className="bg-[#F8FAFC] border-b border-[#E5E7EB] rounded-t-2xl px-3 py-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("bold")
                ? "bg-[#005AE0] text-white shadow-xs font-bold"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Tebal (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("italic")
                ? "bg-[#005AE0] text-white shadow-xs italic"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Miring (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("underline")
                ? "bg-[#005AE0] text-white shadow-xs underline"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Garis Bawah (Underline)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#E5E7EB] mx-1" />

          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("heading", { level: 2 })
                ? "bg-[#005AE0] text-white shadow-xs font-bold"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Subjudul Utama (Heading 2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("heading", { level: 3 })
                ? "bg-[#005AE0] text-white shadow-xs font-bold"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Subjudul Sekunder (Heading 3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#E5E7EB] mx-1" />

          {/* Quote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("blockquote")
                ? "bg-[#005AE0] text-white shadow-xs"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Kutipan Editorial (Blockquote)"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("bulletList")
                ? "bg-[#005AE0] text-white shadow-xs"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Daftar Poin (Bullet List)"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("orderedList")
                ? "bg-[#005AE0] text-white shadow-xs"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title="Daftar Angka (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[#E5E7EB] mx-1" />

          {/* Link */}
          <button
            type="button"
            onClick={handleLink}
            className={cn(
              "p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer",
              editor.isActive("link")
                ? "bg-[#005AE0] text-white shadow-xs"
                : "text-gray-700 hover:bg-white hover:text-[#005AE0]"
            )}
            title={editor.isActive("link") ? "Hapus / Ubah Tautan" : "Sisipkan Tautan"}
          >
            {editor.isActive("link") ? <Unlink className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          </button>

          {/* Insert Image */}
          <label
            className={cn(
              "p-1.5 sm:p-2 rounded-lg hover:bg-white text-gray-700 hover:text-[#005AE0] hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5",
              isUploadingImage && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
            title="Unggah Gambar Naskah (Otomatis dikompresi WebP & hemat penyimpanan)"
          >
            {isUploadingImage ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#005AE0]" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingImage}
              onChange={handleImageFile}
              className="sr-only"
            />
          </label>

          {isUploadingImage && (
            <span className="text-xs text-[#005AE0] font-medium animate-pulse hidden sm:inline-block">
              Mengompres & mengunggah...
            </span>
          )}

          <div className="h-4 w-px bg-[#E5E7EB] mx-1" />

          {/* Undo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Batal Perubahan (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Ulangi Perubahan (Redo)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Realtime Stats Badge */}
        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] font-medium bg-white px-2.5 py-1 rounded-md border border-[#E5E7EB]">
          <span>{wordCount} kata</span>
          <span className="text-gray-300">•</span>
          <span>~{readingTime} mnt baca</span>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Bottom Status Bar */}
      <div className="border-t border-[#F0F4F8] px-5 sm:px-7 py-3 bg-[#FAFCFF] rounded-b-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          Studio Penulisan Media Karya Mahasiswa UNTAG Banyuwangi & UKM Pilar Bangsa
        </span>
        <span>{charCount} karakter</span>
      </div>
    </div>
  );
}
