import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { shortenString } from "utils/usedapp-external";

type ApiKeysMenuProps<T extends Pick<ApiKey, "name" | "key">> = {
  apiKeys: T[];
  selectedKey: T | undefined;
  onSelect: (apiKey: T) => void;
};

export function ApiKeysMenu<T extends Pick<ApiKey, "name" | "key">>(
  props: ApiKeysMenuProps<T>,
) {
  const { apiKeys, selectedKey, onSelect } = props;
  return (
    <Select
      value={selectedKey?.key}
      onValueChange={(key) => {
        const selectedKey = apiKeys.find((apiKey) => apiKey.key === key);
        if (selectedKey) {
          onSelect(selectedKey);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {apiKeys.map((apiKey) => (
          <SelectItem key={apiKey.key} value={apiKey.key}>
            {apiKey.name} ({shortenString(apiKey.key)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
