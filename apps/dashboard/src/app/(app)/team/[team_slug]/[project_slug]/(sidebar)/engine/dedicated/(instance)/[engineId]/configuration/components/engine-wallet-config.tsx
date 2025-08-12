import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "@/constants/engine";
import {
  type EngineInstance,
  useEngineWalletConfig,
  useHasEngineFeature,
} from "@/hooks/useEngine";
import { cn } from "@/lib/utils";
import { CircleConfig } from "./circle-config";
import { KmsAwsConfig } from "./kms-aws-config";
import { KmsGcpConfig } from "./kms-gcp-config";
import { LocalConfig } from "./local-config";

export function EngineWalletConfig({
  instance,
  teamSlug,
  projectSlug,
  authToken,
}: {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}) {
  const { data: walletConfig } = useEngineWalletConfig({
    authToken,
    instanceUrl: instance.url,
  });

  const { isSupported: isWalletCredentialsSupported } = useHasEngineFeature(
    instance.url,
    "WALLET_CREDENTIALS",
  );

  const filteredWalletOptions = EngineBackendWalletOptions.filter(
    ({ key }) =>
      // circle wallets were only added with the WALLET_CREDENTIALS feature flag
      (key !== "circle" || isWalletCredentialsSupported) &&
      // smart wallets don't need separate configuration
      !key.startsWith("smart:"),
  );

  const tabContent: Partial<Record<EngineBackendWalletType, React.ReactNode>> =
    {
      "aws-kms": <KmsAwsConfig authToken={authToken} instance={instance} />,
      "gcp-kms": <KmsGcpConfig authToken={authToken} instance={instance} />,
      local: <LocalConfig />,
      // circle wallets were only added with the WALLET_CREDENTIALS feature flag
      ...(isWalletCredentialsSupported && {
        circle: <CircleConfig authToken={authToken} instance={instance} />,
      }),
    } as const;

  const [activeTab, setActiveTab] = useState<EngineBackendWalletType>("local");

  const isAwsKmsConfigured = !!walletConfig?.awsAccessKeyId;
  const isGcpKmsConfigured = !!walletConfig?.gcpKmsKeyRingId;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight mb-1">
          Backend Wallets
        </h2>
        <p className="text-muted-foreground text-sm">
          Create backend wallets on the{" "}
          <UnderlineLink
            href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}`}
          >
            Overview
          </UnderlineLink>{" "}
          tab. To use other wallet types, configure them below.
        </p>
      </div>

      <TabButtons
        tabs={filteredWalletOptions.map(({ key, name }) => ({
          icon:
            (key === "aws-kms" && !isAwsKmsConfigured) ||
            (key === "gcp-kms" && !isGcpKmsConfigured)
              ? ({ className }) => (
                  <ToolTipLabel label="Not configured">
                    <CircleAlertIcon className={cn(className, "size-4")} />
                  </ToolTipLabel>
                )
              : undefined,
          isActive: activeTab === key,
          key,
          name,
          onClick: () => setActiveTab(key),
        }))}
      />

      <div className="mt-4 space-y-4">
        {!isWalletCredentialsSupported && activeTab === "circle" && (
          <Alert className="mt-4" variant="warning">
            <CircleAlertIcon className="size-4" />
            <AlertTitle>Update Required</AlertTitle>
            <AlertDescription>
              Circle wallet support requires a newer version of Engine. Please
              update your Engine instance to use this feature.
            </AlertDescription>
          </Alert>
        )}

        {tabContent[activeTab]}
      </div>
    </div>
  );
}
