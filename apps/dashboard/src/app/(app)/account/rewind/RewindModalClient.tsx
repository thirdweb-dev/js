"use client";

import { useEffect, useState } from "react";
import { RewindModal } from "./RewindModal";

export function RewindModalClient() {
  const [open, setOpen] = useState(false);
  const displayYear = 2025; // Match the hardcoded year in RewindModal
  const currentMonth = new Date().getMonth();
  const _currentDay = new Date().getDate();

  // Show rewind modal in December or January
  // Check if user has seen it for the display year
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const hasSeenRewind = localStorage.getItem(`rewind-seen-${displayYear}`);
    const shouldShowRewind =
      (currentMonth === 11 || currentMonth === 0) && !hasSeenRewind;

    if (shouldShowRewind) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentMonth]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Mark as seen for the display year
      localStorage.setItem(`rewind-seen-${displayYear}`, "true");
    }
  };

  return <RewindModal open={open} onOpenChange={handleOpenChange} />;
}
