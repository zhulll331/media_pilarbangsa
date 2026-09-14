"use client";

import { useEffect } from "react";
import { incrementViewCount } from "@/actions/posts";

export function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    if (postId) {
      incrementViewCount(postId);
    }
  }, [postId]);

  return null;
}
