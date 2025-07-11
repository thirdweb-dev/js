"use client";
import { BotIcon } from "lucide-react";
import { useState } from "react";

export function SupportAIChatCard({
  _authToken,
  _teamId,
  onStartChat,
}: {
  _authToken?: string;
  _teamId?: string;
  onStartChat: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <div className="rounded-lg border bg-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-block size-8 rounded-full bg-blue-900 flex items-center justify-center">
          <BotIcon className="text-lg text-white" />
        </span>
        <div>
          <div className="font-semibold">Ask AI for support</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-green-500 mr-1"></span>
            Online
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="rounded bg-[#181C24] px-4 py-3 text-sm text-white">
          I’ll help you troubleshoot. If I can’t fix it, I’ll pass it to our
          support team.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2 bg-background text-white placeholder:text-muted-foreground"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && message.trim()) {
              e.preventDefault();
              onStartChat(message);
            }
          }}
          placeholder="Type a message..."
          value={message}
        />
        <button
          className="bg-[#2663EB] hover:bg-[#2663EB]/90 text-white rounded-md px-4 py-2"
          disabled={!message.trim()}
          onClick={() => onStartChat(message)}
          type="button"
        >
          Start Chat
        </button>
      </div>
    </div>
  );
}
