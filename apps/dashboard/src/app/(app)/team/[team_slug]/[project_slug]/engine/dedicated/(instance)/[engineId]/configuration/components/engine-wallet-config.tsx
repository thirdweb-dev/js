import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type EngineInstance,
  useEngineWalletConfig,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "lib/engine";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Heading } from "tw-components";
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
    instanceUrl: instance.url,
    authToken,
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
      local: <LocalConfig />,
      "aws-kms": <KmsAwsConfig instance={instance} authToken={authToken} />,
      "gcp-kms": <KmsGcpConfig instance={instance} authToken={authToken} />,
      // circle wallets were only added with the WALLET_CREDENTIALS feature flag
      ...(isWalletCredentialsSupported && {
        circle: <CircleConfig instance={instance} authToken={authToken} />,
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
            href={`/team/${teamSlug}/${projectSlug}/engine/dedicated/${instance.id}`}
            className="text-link-foreground hover:text-foreground"
          >
            Overview
          </Link>{" "}
          tab. To use other wallet types, configure them below.
        </p>
      </div>

      <TabButtons
        tabs={filteredWalletOptions.map(({ key, name }) => ({
          key,
          name,
          isActive: activeTab === key,
          onClick: () => setActiveTab(key),
          icon:
            (key === "aws-kms" && !isAwsKmsConfigured) ||
            (key === "gcp-kms" && !isGcpKmsConfigured)
              ? ({ className }) => (
                  <ToolTipLabel label="Not configured">
                    <CircleAlertIcon className={cn(className, "size-4")} />
                  </ToolTipLabel>
                )
              : undefined,
        }))}
        tabClassName="font-medium !text-sm"
      />

      {!isWalletCredentialsSupported && activeTab === "circle" && (
        <Alert variant="warning" className="mt-4">
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
