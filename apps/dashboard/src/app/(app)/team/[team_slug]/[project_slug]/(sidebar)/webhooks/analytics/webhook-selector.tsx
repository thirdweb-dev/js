"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { WebhookConfig } from "@/api/webhooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebhookSelectorProps {
  webhooks: WebhookConfig[];
  selectedWebhookId: string | null;
}

export function WebhookSelector({
  webhooks,
  selectedWebhookId,
}: WebhookSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Webhook Filter</label>
      <Select
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams);
          if (value === "all") {
            params.delete("webhookId");
          } else {
            params.set("webhookId", value);
          }
          router.push(`?${params.toString()}`);
        }}
        value={selectedWebhookId || "all"}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select webhook" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Webhooks</SelectItem>
          {webhooks.map((webhook) => (
            <SelectItem key={webhook.id} value={webhook.id}>
              {webhook.description || webhook.destinationUrl}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
