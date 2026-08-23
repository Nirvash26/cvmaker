"use client";

import { motion } from "framer-motion";

/**
 * Skeleton loading card — used in dashboard and template gallery
 * to display polished loading state.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-xl glass-card overflow-hidden">
      <div className="bg-[#1a1a1a]" style={{ aspectRatio: "1 / 1.3" }}>
        <div className="h-full w-full shimmer" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#3D4944] rounded w-2/3 shimmer" />
        <div className="h-3 bg-[#3D4944] rounded w-1/3 shimmer" />
        <div className="flex gap-2 mt-3">
          <div className="h-7 bg-[#3D4944] rounded flex-1 shimmer" />
          <div className="h-7 w-7 bg-[#3D4944] rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4 glass-card rounded-xl">
      <div className="w-12 h-12 rounded-full bg-[#3D4944] shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-[#3D4944] rounded w-1/2 shimmer" />
        <div className="h-2 bg-[#3D4944] rounded w-1/3 shimmer" />
      </div>
    </div>
  );
}
