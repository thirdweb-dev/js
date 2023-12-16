import {
  useEngineBackendWallets,
  useEngineTransactions,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch, Tooltip } from "@chakra-ui/react";
import { BackendWalletsTable } from "./backend-wallets-table";
import { TransactionsTable } from "./transactions-table";
import { Badge, Card, FormLabel, Heading, Link, Text } from "tw-components";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { useState } from "react";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";

interface EngineOverviewProps {
  instance: string;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({ instance }) => {
  const backendWallets = useEngineBackendWallets(instance);
  const { data: walletConfig } = useEngineWalletConfig(instance);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const transactionsQuery = useEngineTransactions(instance, autoUpdate);

  return (
    <Flex flexDir="column" gap={12}>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={4} justifyItems="flex-end">
          <Flex justify="space-between" alignItems="center">
            <Flex flexDir="column" gap={2}>
              <Flex gap={3}>
                <Heading size="title.sm">Backend Wallets</Heading>
                {walletConfig?.type && (
                  <Tooltip
                    placement="auto-end"
                    borderRadius="md"
                    bg="transparent"
                    boxShadow="none"
                    p={4}
                    minW={{ md: "450px" }}
                    label={
                      <Card bgColor="backgroundHighlight">
                        <Text>
                          Engine is configured to use{" "}
                          {walletConfig.type === "aws-kms"
                            ? "backend wallets secured by AWS KMS"
                            : walletConfig.type === "gcp-kms"
                            ? "backend wallets secured by GCP KMS"
                            : "local backend wallets"}
                          . You can change this in the Configuration tab.
                        </Text>
                      </Card>
                    }
                  >
                    <Badge
                      borderRadius="full"
                      size="label.sm"
                      variant="outline"
                      px={3}
                      py={1.5}
                      colorScheme="green"
                    >
                      {walletConfig.type.replace("-", " ")}
                    </Badge>
                  </Tooltip>
                )}
              </Flex>
              <Text>
                Engine performs blockchain actions using backend wallets you own
                and manage.{" "}
                <Link
                  href="https://portal.thirdweb.com/engine/backend-wallets"
                  color="primary.500"
                  isExternal
                >
                  Learn more
                </Link>
                .
              </Text>
            </Flex>

            <Flex gap={2}>
              <ImportBackendWalletButton instance={instance} />
              <CreateBackendWalletButton instance={instance} />
            </Flex>
          </Flex>

          <Flex flexDirection="row-reverse">
            <Flex alignItems="center" gap={2}>
              <Text>Show balance for</Text>
              <Flex>
                <NetworkSelectorButton />
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <BackendWalletsTable
          instanceUrl={instance}
          wallets={backendWallets.data ?? []}
          isLoading={backendWallets.isLoading}
          isFetched={backendWallets.isFetched}
        />
      </Flex>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="row" gap={2} justify="space-between">
          <Flex flexDir="column" gap={2}>
            <Heading size="title.sm">Transactions</Heading>
            <Text>
              View transactions sent from your backend wallets in the past 24
              hours.
            </Text>
          </Flex>

          <Flex>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="auto-update" mb="0">
                Auto-Update
              </FormLabel>
              <Switch
                isChecked={autoUpdate}
                onChange={() => setAutoUpdate((val) => !val)}
                id="auto-update"
              />
            </FormControl>
          </Flex>
        </Flex>
        <TransactionsTable
          transactions={transactionsQuery.data?.transactions ?? []}
          isLoading={transactionsQuery.isLoading}
          isFetched={transactionsQuery.isFetched}
          instanceUrl={instance}
        />
      </Flex>
    </Flex>
  );
};
