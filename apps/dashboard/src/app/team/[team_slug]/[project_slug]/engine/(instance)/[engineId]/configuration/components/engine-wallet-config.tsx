import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type EngineInstance,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
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
}

export const EngineWalletConfig: React.FC<EngineWalletConfigProps> = ({
  instance,
}) => {
  const { data: walletConfig } = useEngineWalletConfig(instance.url);

  const tabContent: Record<EngineBackendWalletType, React.ReactNode> = {
    local: <LocalConfig />,
    "aws-kms": <KmsAwsConfig instance={instance} />,
    "gcp-kms": <KmsGcpConfig instance={instance} />,
  } as const;

  const [activeTab, setActiveTab] = useState<EngineBackendWalletType>("local");

  const isAwsKmsConfigured = !!walletConfig?.awsAccessKeyId;
  const isGcpKmsConfigured = !!walletConfig?.gcpKmsKeyRingId;

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Backend Wallets</Heading>
        <p className="text-muted-foreground">
          Create backend wallets on the{" "}
          <Link
            href={`/dashboard/engine/${instance.id}`}
            className="text-link-foreground hover:text-foreground"
          >
            Overview
          </Link>{" "}
          tab. To use other wallet types, configure them below.
        </p>
      </Flex>

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
    </Flex>
  );
};
