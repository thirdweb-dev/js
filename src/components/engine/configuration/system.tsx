import { useEngineSystemHealth } from "@3rdweb-sdk/react/hooks/useEngine";
import { Text } from "tw-components";

interface EngineSystemProps {
  instanceUrl: string;
}

export const EngineSystem: React.FC<EngineSystemProps> = ({ instanceUrl }) => {
  const { data } = useEngineSystemHealth(instanceUrl);
  if (!data) {
    return null;
  }

  return (
    <Text fontSize="x-small" fontFamily="mono" opacity={0.5} gap={0}>
      Version: {data.engineVersion ?? "..."}
      <br />
      Enabled: {data.features?.join(", ")}
    </Text>
  );
};
