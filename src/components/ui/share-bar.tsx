"use client";

import React, { useState } from "react";
import { MessageCircle, Share2, Copy, Check } from "lucide-react";
import { usePortal } from "@/context/portal-context";
import { cn } from "@/lib/utils";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export interface ShareBarProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareBar({ title, url, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = usePortal();

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopy = async () => {
    const currentUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast("Tautan artikel berhasil disalin ke clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Gagal menyalin tautan", "error");
    }
  };

  const handleNativeShare = async () => {
    const currentUrl = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5" />,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + getShareUrl())}`,
      color: "hover:text-emerald-600 hover:bg-emerald-50",
    },
    {
      name: "X (Twitter)",
      icon: <XIcon className="w-4 h-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getShareUrl())}`,
      color: "hover:text-black hover:bg-gray-100",
    },
    {
      name: "Facebook",
      icon: <FacebookIcon className="w-4 h-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
      color: "hover:text-blue-600 hover:bg-blue-50",
    },
  ];

  return (
    <div className={cn("flex items-center gap-1.5 py-2", className)}>
      <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mr-1 hidden sm:inline">
        Bagikan:
      </span>

      {shareLinks.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Bagikan ke ${item.name}`}
          className={cn(
            "p-2 rounded-full text-[#6B7280] transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]",
            item.color
          )}
        >
          {item.icon}
        </a>
      ))}

      <button
        onClick={handleCopy}
        title="Salin Tautan"
        className="p-2 rounded-full text-[#6B7280] hover:text-[#005AE0] hover:bg-blue-50 transition-colors flex items-center justify-center min-w-[40px] min-h-[40px] cursor-pointer"
      >
        {copied ? <Check className="w-5 h-5 text-[#059669]" /> : <Copy className="w-5 h-5" />}
      </button>

      <button
        onClick={handleNativeShare}
        title="Bagikan"
        className="sm:hidden p-2 rounded-full text-[#6B7280] hover:text-[#005AE0] hover:bg-blue-50 transition-colors flex items-center justify-center min-w-[40px] min-h-[40px] cursor-pointer"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}
