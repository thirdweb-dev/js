"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chat } from "@/components/AI/chat";

const queryClient = new QueryClient();

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-[calc(100vh-65px)] flex-col overflow-hidden lg:h-[calc(100vh-102px)]">
        <Chat />
      </div>
    </QueryClientProvider>
  );
}
