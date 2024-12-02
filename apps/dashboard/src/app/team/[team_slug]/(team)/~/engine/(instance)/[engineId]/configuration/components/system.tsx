import {
  type EngineInstance,
  useEngineSystemHealth,
  useEngineSystemMetrics,
} from "@3rdweb-sdk/react/hooks/useEngine";

interface EngineSystemProps {
  instance: EngineInstance;
}

export const EngineSystem: React.FC<EngineSystemProps> = ({ instance }) => {
  const healthQuery = useEngineSystemHealth(instance.url);
  const metricsQuery = useEngineSystemMetrics(instance.id);
  if (!healthQuery.data) {
    return null;
  }

  return (
    <p className="gap-0 font-mono text-xs opacity-50">
      Version: {healthQuery.data.engineVersion ?? "..."}
      <br />
      Enabled: {healthQuery.data.features?.join(", ")}
      <br />
      CPU: {metricsQuery.data?.data?.cpu?.toFixed(2) ?? "..."}%
      <br />
      Memory: {metricsQuery.data?.data?.memory?.toFixed(0) ?? "..."}MB
    </p>
  );
};
