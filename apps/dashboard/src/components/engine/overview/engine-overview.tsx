"use client";

import { Badge } from "@/components/ui/badge";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  useEngineBackendWallets,
  useEngineTransactions,
  useEngineWalletConfig,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch } from "@chakra-ui/react";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { useState } from "react";
import { FormLabel, Heading, Link, Text } from "tw-components";
import { BackendWalletsTable } from "./backend-wallets-table";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { TransactionsTable } from "./transactions-table";

interface EngineOverviewProps {
  instanceUrl: string;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({
  instanceUrl,
}) => {
  const backendWallets = useEngineBackendWallets(instanceUrl);
  const { data: walletConfig } = useEngineWalletConfig(instanceUrl);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const transactionsQuery = useEngineTransactions(instanceUrl, autoUpdate);

  return (
    <Flex flexDir="column" gap={12}>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={4} justifyItems="flex-end">
          <Flex justify="space-between" alignItems="center">
            <Flex flexDir="column" gap={2}>
              <Flex gap={3}>
                <Heading size="title.sm">Backend Wallets</Heading>
                {walletConfig?.type && (
                  <ToolTipLabel
                    label={
                      <>
                        This engine is configured to use{" "}
                        {walletConfig.type === "aws-kms"
                          ? "backend wallets secured by AWS KMS"
                          : walletConfig.type === "gcp-kms"
                            ? "backend wallets secured by GCP KMS"
                            : "local backend wallets"}
                        . You can change this in the Configuration tab.
                      </>
                    }
                  >
                    <div>
                      <Badge variant="outline">
                        {walletConfig.type.replace("-", " ")}
                      </Badge>
                    </div>
                  </ToolTipLabel>
                )}
              </Flex>
              <Text>
                Engine performs blockchain actions using backend wallets you own
                and manage.{" "}
                <Link
                  href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
                  color="primary.500"
                  isExternal
                >
                  Learn more
                </Link>
              </Text>
            </Flex>

            <Flex gap={2}>
              <ImportBackendWalletButton instanceUrl={instanceUrl} />
              <CreateBackendWalletButton instanceUrl={instanceUrl} />
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
          instanceUrl={instanceUrl}
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
          instanceUrl={instanceUrl}
        />
      </Flex>
    </Flex>
  );
};
