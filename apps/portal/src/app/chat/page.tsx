"use client";

import { Chat } from "@/components/AI/chat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ChatPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-auto flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden lg:size-[calc(100vh-8rem)]">
        <Chat />
      </div>
    </QueryClientProvider>
  );
}
