import { useCallback, useState } from "react";
import type { ExecuteConfig } from "../api/types";

export function useExecuteConfig() {
  const [executeConfig, _setExecuteConfig] = useState<ExecuteConfig | null>(
    () => {
      // Try to load config from localStorage on initial render
      if (typeof window !== "undefined") {
        const savedConfig = localStorage.getItem("executeConfig");
        return savedConfig ? JSON.parse(savedConfig) : null;
      }
      return null;
    },
  );

  const setExecuteConfig = useCallback((config: ExecuteConfig) => {
    _setExecuteConfig(config);
    try {
      localStorage.setItem("executeConfig", JSON.stringify(config));
    } catch {
      // ignore
    }
  }, []);

  return [executeConfig, setExecuteConfig] as const;
}
