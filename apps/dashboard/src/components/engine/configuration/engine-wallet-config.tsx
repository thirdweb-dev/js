import { useEngineWalletConfig } from "@3rdweb-sdk/react/hooks/useEngine";
import { ButtonGroup, Flex, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { Button, Heading, Link, Text } from "tw-components";
import { KmsAwsConfig } from "./kms-aws-config";
import { KmsGcpConfig } from "./kms-gcp-config";
import { LocalConfig } from "./local-config.tsx";

interface EngineWalletConfigProps {
  instanceUrl: string;
}

export const EngineWalletConfig: React.FC<EngineWalletConfigProps> = ({
  instanceUrl,
}) => {
  const { data: localConfig } = useEngineWalletConfig(instanceUrl);
  const [selected, setSelected] = useState<"aws-kms" | "gcp-kms" | "local">(
    localConfig?.type || "local",
  );

  return (
    <Flex flexDir="column" gap={4}>
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Backend Wallets</Heading>
        <Text>
          Select the type of backend wallets to use.{" "}
          <Link
            href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
            color="primary.500"
            isExternal
          >
            Learn more about backend wallets
          </Link>
          .
        </Text>
      </Flex>
      <Flex flexDir="column" gap={4}>
        <ButtonGroup size="sm" variant="outline" spacing={2}>
          <Button
            type="button"
            leftIcon={
              <Icon
                as={
                  selected === "local"
                    ? MdRadioButtonChecked
                    : MdRadioButtonUnchecked
                }
                boxSize={6}
              />
            }
            borderColor={selected === "local" ? "unset" : undefined}
            colorScheme={selected === "local" ? "blue" : undefined}
            py={6}
            rounded="lg"
            onClick={() => setSelected("local")}
          >
            Local Wallet
          </Button>
          <Button
            type="button"
            leftIcon={
              selected === "aws-kms" ? (
                <MdRadioButtonChecked />
              ) : (
                <MdRadioButtonUnchecked />
              )
            }
            borderColor={selected === "aws-kms" ? "unset" : undefined}
            colorScheme={selected === "aws-kms" ? "blue" : undefined}
            py={6}
            rounded="lg"
            onClick={() => setSelected("aws-kms")}
          >
            AWS KMS
          </Button>
          <Button
            type="button"
            leftIcon={
              selected === "gcp-kms" ? (
                <MdRadioButtonChecked />
              ) : (
                <MdRadioButtonUnchecked />
              )
            }
            borderColor={selected === "gcp-kms" ? "unset" : undefined}
            colorScheme={selected === "gcp-kms" ? "blue" : undefined}
            py={6}
            rounded="lg"
            onClick={() => setSelected("gcp-kms")}
          >
            Google KMS
          </Button>
        </ButtonGroup>

        {selected === "local" && <LocalConfig instanceUrl={instanceUrl} />}
        {selected === "aws-kms" && <KmsAwsConfig instanceUrl={instanceUrl} />}
        {selected === "gcp-kms" && <KmsGcpConfig instanceUrl={instanceUrl} />}
      </Flex>
    </Flex>
  );
};
