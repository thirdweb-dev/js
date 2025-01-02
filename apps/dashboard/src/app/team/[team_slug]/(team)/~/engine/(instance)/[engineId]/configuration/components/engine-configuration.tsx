"use client";

import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { EngineCorsConfig } from "./cors";
import { EngineWalletConfig } from "./engine-wallet-config";
import { EngineIpAllowlistConfig } from "./ip-allowlist";
import { EngineSystem } from "./system";

interface EngineConfigurationProps {
  instance: EngineInstance;
  teamSlug: string;
  authToken: string;
}

export const EngineConfiguration: React.FC<EngineConfigurationProps> = ({
  instance,
  teamSlug,
  authToken,
}) => {
  return (
    <div className="flex flex-col gap-12">
      <EngineWalletConfig
        instance={instance}
        teamSlug={teamSlug}
        authToken={authToken}
      />
      <EngineCorsConfig instanceUrl={instance.url} authToken={authToken} />
      <EngineIpAllowlistConfig
        instanceUrl={instance.url}
        authToken={authToken}
      />
      <EngineSystem instance={instance} />
    </div>
  );
};
