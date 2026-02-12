"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Prevents casual downloading/copying of card images and proprietary content.
 * Not bulletproof (nothing client-side is), but deters casual scrapers.
 */
export function ContentProtection({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Prevent right-click context menu on images
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "IMG" ||
        target.closest("[data-protected]") ||
        target.closest(".card-image-protected")
      ) {
        e.preventDefault();
      }
    };

    // Prevent drag on images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return <>{children}</>;
}
