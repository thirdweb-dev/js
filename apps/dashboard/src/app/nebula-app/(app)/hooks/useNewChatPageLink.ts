"use client";

import { useStore } from "@/lib/reactive";
import { newChatPageUrlStore } from "../stores";

export function useNewChatPageLink() {
  const newChatPage = useStore(newChatPageUrlStore);
  return newChatPage || "/chat";
}
