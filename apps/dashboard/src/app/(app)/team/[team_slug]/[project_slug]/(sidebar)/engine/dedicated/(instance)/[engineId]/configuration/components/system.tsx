import {
  type EngineInstance,
  useEngineSystemHealth,
  useEngineSystemMetrics,
} from "@/hooks/useEngine";

interface EngineSystemProps {
  instance: EngineInstance;
  teamIdOrSlug: string;
  projectSlug: string;
}

export const EngineSystem: React.FC<EngineSystemProps> = ({
  instance,
  teamIdOrSlug,
  projectSlug,
}) => {
  const healthQuery = useEngineSystemHealth(instance.url);
  const metricsQuery = useEngineSystemMetrics(
    instance.id,
    teamIdOrSlug,
    projectSlug,
  );
  if (!healthQuery.data) {
    return null;
  }

  return (
    <p className="gap-0 font-mono text-xs opacity-50">
      Version: {healthQuery.data.engineVersion ?? "..."}
      <br />
      Enabled: {healthQuery.data.features?.join(", ")}
      <br />
      CPU: {metricsQuery.data?.result?.cpu?.toFixed(2) ?? "..."}%
      <br />
      Memory: {metricsQuery.data?.result?.memory?.toFixed(0) ?? "..."}MB
    </p>
  );
};
