import React from "react";
import { TopUtilityBar } from "@/components/public/top-utility-bar";
import { Header } from "@/components/public/header";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function CategoryLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <TopUtilityBar />
      <Header />
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb Skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
          </div>

          {/* Banner Skeleton */}
          <div className="bg-[#F0F4F8] border border-[#E5E7EB] rounded-2xl p-6 sm:p-10 mb-10 animate-pulse">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-[#005AE0]/20 rounded" />
                <div className="h-3 w-28 bg-[#005AE0]/20 rounded" />
              </div>
              <div className="h-8 sm:h-10 w-48 sm:w-64 bg-gray-300 rounded-lg mb-4" />
              <div className="space-y-2 max-w-xl">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
              <div className="mt-5 h-6 w-36 bg-white rounded-full border border-gray-200" />
            </div>
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden flex flex-col animate-pulse"
              >
                {/* Image Skeleton */}
                <div className="relative aspect-16/10 bg-gray-200 overflow-hidden">
                  <div className="absolute top-3 left-3 h-5 w-20 bg-gray-300 rounded-full" />
                </div>
                {/* Content Skeleton */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="h-4 bg-gray-300 rounded w-11/12" />
                      <div className="h-4 bg-gray-300 rounded w-4/5" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-5 w-14 bg-gray-100 rounded-full" />
                      <div className="h-5 w-16 bg-gray-100 rounded-full" />
                    </div>
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
