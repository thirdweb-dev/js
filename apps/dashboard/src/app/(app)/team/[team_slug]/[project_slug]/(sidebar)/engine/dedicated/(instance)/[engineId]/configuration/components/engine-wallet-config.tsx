import { Heading } from "chakra/heading";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
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

interface EngineWalletConfigProps {
  instance: EngineInstance;
  teamSlug: string;
  projectSlug: string;
  authToken: string;
}

export const EngineWalletConfig: React.FC<EngineWalletConfigProps> = ({
  instance,
  teamSlug,
  projectSlug,
  authToken,
}) => {
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Heading size="title.md">Backend Wallets</Heading>
        <p className="text-muted-foreground">
          Create backend wallets on the{" "}
          <Link
            className="text-link-foreground hover:text-foreground"
            href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}`}
          >
            Overview
          </Link>{" "}
          tab. To use other wallet types, configure them below.
        </p>
      </div>

      <TabButtons
        tabClassName="font-medium !text-sm"
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
  );
};
