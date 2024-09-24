"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";

export function APIKeySelector(props: {
  apiKeys: ApiKey[];
  selectedApiKey: ApiKey;
}) {
  const router = useDashboardRouter();

  return (
    <Select
      value={props.selectedApiKey.id}
      onValueChange={(keyId) => {
        const newKey = props.apiKeys.find((x) => x.id === keyId);
        if (newKey) {
          router.push(`/dashboard/connect/pay/${newKey.id}`);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue>{props.selectedApiKey.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {props.apiKeys.map((key) => (
          <SelectItem key={key.id} value={key.id}>
            {key.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
