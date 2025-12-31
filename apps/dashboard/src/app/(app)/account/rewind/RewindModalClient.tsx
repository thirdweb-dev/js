"use client";

import { useEffect, useState } from "react";
import { RewindModal } from "./RewindModal";

export function RewindModalClient() {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const _currentDay = new Date().getDate();

  // Show rewind modal in December or January
  // Check if user has seen it this year
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const hasSeenRewind = localStorage.getItem(`rewind-seen-${currentYear}`);
    const shouldShowRewind =
      (currentMonth === 11 || currentMonth === 0) && !hasSeenRewind;

    if (shouldShowRewind) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentYear, currentMonth]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Mark as seen for this year
      localStorage.setItem(`rewind-seen-${currentYear}`, "true");
    }
  };

  return <RewindModal open={open} onOpenChange={handleOpenChange} />;
}
