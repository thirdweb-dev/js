import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type EngineInstance,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  EngineBackendWalletOptions,
  type EngineBackendWalletType,
} from "lib/engine";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Heading } from "tw-components";
import { KmsAwsConfig } from "./kms-aws-config";
import { KmsGcpConfig } from "./kms-gcp-config";
import { LocalConfig } from "./local-config";

interface EngineWalletConfigProps {
  instance: EngineInstance;
  teamSlug: string;
  authToken: string;
}

export const EngineWalletConfig: React.FC<EngineWalletConfigProps> = ({
  instance,
  teamSlug,
  authToken,
}) => {
  const { data: walletConfig } = useEngineWalletConfig({
    instanceUrl: instance.url,
    authToken,
  });

  const tabContent: Partial<Record<EngineBackendWalletType, React.ReactNode>> =
    {
      local: <LocalConfig />,
      "aws-kms": <KmsAwsConfig instance={instance} authToken={authToken} />,
      "gcp-kms": <KmsGcpConfig instance={instance} authToken={authToken} />,
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
            href={`/team/${teamSlug}/~/engine/${instance.id}`}
            className="text-link-foreground hover:text-foreground"
          >
            Overview
          </Link>{" "}
          tab. To use other wallet types, configure them below.
        </p>
      </div>

      <TabButtons
        tabs={EngineBackendWalletOptions.map(({ key, name }) => ({
          key,
          name,
          isActive: activeTab === key,
          isEnabled: true,
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

      {tabContent[activeTab]}
    </div>
  );
};
