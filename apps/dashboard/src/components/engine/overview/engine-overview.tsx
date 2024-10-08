"use client";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  type EngineInstance,
  useEngineBackendWallets,
  useEngineTransactions,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, FormControl, Switch } from "@chakra-ui/react";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { useState } from "react";
import { FormLabel, Heading, Text } from "tw-components";
import { BackendWalletsTable } from "./backend-wallets-table";
import { CreateBackendWalletButton } from "./create-backend-wallet-button";
import { ImportBackendWalletButton } from "./import-backend-wallet-button";
import { TransactionsTable } from "./transactions-table";

interface EngineOverviewProps {
  instance: EngineInstance;
}

export const EngineOverview: React.FC<EngineOverviewProps> = ({ instance }) => {
  const backendWallets = useEngineBackendWallets(instance.url);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const transactionsQuery = useEngineTransactions(instance.url, autoUpdate);

  return (
    <Flex flexDir="column" gap={12}>
      <Flex flexDir="column" gap={4}>
        <Flex flexDir="column" gap={4} justifyItems="flex-end">
          <Flex justify="space-between" alignItems="center">
            <Flex flexDir="column" gap={2}>
              <Heading size="title.sm">Backend Wallets</Heading>
              <p className="text-sm">
                Engine sends blockchain transactions from backend wallets you
                own and manage.{" "}
                <TrackedLinkTW
                  target="_blank"
                  href="https://portal.thirdweb.com/infrastructure/engine/features/backend-wallets"
                  label="learn-more"
                  category="engine"
                  className="text-link-foreground hover:text-foreground"
                >
                  Learn more about backend wallets.
                </TrackedLinkTW>
              </p>
              <p className="text-sm">
                Set up other wallet types from the{" "}
                <strong>Configuration</strong> tab.
              </p>
            </Flex>

            <div className="flex flex-row gap-2">
              <ImportBackendWalletButton instance={instance} />
              <CreateBackendWalletButton instance={instance} />
            </div>
          </Flex>

          <Flex flexDirection="row-reverse">
            <Flex alignItems="center" gap={2}>
              <Text>Show balance for</Text>
              <div className="flex flex-row">
                <NetworkSelectorButton />
              </div>
            </Flex>
          </Flex>
        </Flex>

        <BackendWalletsTable
          instanceUrl={instance.url}
          wallets={backendWallets.data ?? []}
          isPending={backendWallets.isPending}
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

          <div className="flex flex-row">
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
          </div>
        </Flex>
        <TransactionsTable
          transactions={transactionsQuery.data?.transactions ?? []}
          isPending={transactionsQuery.isPending}
          isFetched={transactionsQuery.isFetched}
          instanceUrl={instance.url}
        />
      </Flex>
    </Flex>
  );
};
