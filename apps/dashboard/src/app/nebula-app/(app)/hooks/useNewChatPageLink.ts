"use client";

import { useSelectedLayoutSegment } from "next/navigation";

export function useNewChatPageLink() {
  const selectedLayout = useSelectedLayoutSegment();
  return selectedLayout === "chat" ? "/" : "/chat";
}
