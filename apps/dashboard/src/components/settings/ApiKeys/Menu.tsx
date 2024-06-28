import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { shortenString } from "utils/usedapp-external";

interface ApiKeysMenuProps {
  apiKeys: ApiKey[];
  selectedKey: ApiKey | undefined;
  onSelect: (apiKey: ApiKey) => void;
}

export const ApiKeysMenu: React.FC<ApiKeysMenuProps> = ({
  apiKeys,
  selectedKey,
  onSelect,
}) => {
  return (
    <Select
      value={selectedKey?.id}
      onValueChange={(keyId) => {
        const selectedKey = apiKeys.find((apiKey) => apiKey.id === keyId);
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
          <SelectItem key={apiKey.id} value={apiKey.id}>
            {apiKey.name} ({shortenString(apiKey.key)})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
