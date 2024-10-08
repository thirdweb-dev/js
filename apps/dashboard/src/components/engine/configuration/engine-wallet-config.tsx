import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  type EngineBackendWalletType,
  type EngineInstance,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex } from "@chakra-ui/react";
import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import {} from "react-icons/md";
import { Heading, Text } from "tw-components";
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

  const tabOptions: {
    key: EngineBackendWalletType;
    name: string;
    content: React.ReactNode;
  }[] = [
    {
      key: "local",
      name: "Local",
      content: <LocalConfig />,
    },
    {
      key: "aws-kms",
      name: "AWS KMS",
      content: <KmsAwsConfig instance={instance} />,
    },
    {
      key: "gcp-kms",
      name: "Google Cloud KMS",
      content: <KmsGcpConfig instance={instance} />,
    },
  ] as const;
  const [activeTab, setActiveTab] = useState<EngineBackendWalletType>("local");

  const isAwsKmsConfigured = !!walletConfig?.awsAccessKeyId;
  const isGcpKmsConfigured = !!walletConfig?.gcpKmsKeyRingId;

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Backend Wallets</Heading>
        <Text>
          Create backend wallets on the <strong>Overview</strong> tab. To use
          other wallet types, configure them first.
        </Text>
      </Flex>

      <TabButtons
        tabs={tabOptions.map(({ key, name }) => ({
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
                    <CircleAlertIcon className={className} />
                  </ToolTipLabel>
                )
              : undefined,
        }))}
        tabClassName="font-medium !text-sm"
      />

      {tabOptions.find((opt) => opt.key === activeTab)?.content}
    </Flex>
  );
};
