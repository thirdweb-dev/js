"use client";

import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineCorsConfig } from "./cors";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineIpAllowlistConfig } from "./ip-allowlist";
import { EngineSystem } from "./system";

interface EngineConfigurationProps {
  instance: EngineInstance;
}

export const EngineConfiguration: React.FC<EngineConfigurationProps> = ({
  instance,
}) => {
  return (
    <div className="flex flex-col gap-12">
      <EngineWalletConfig instance={instance} />
      <EngineCorsConfig instanceUrl={instance.url} />
      <EngineIpAllowlistConfig instanceUrl={instance.url} />
      <EngineSystem instance={instance} />
    </div>
  );
};
