"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chat } from "@/components/AI/chat";

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
