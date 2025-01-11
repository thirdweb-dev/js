"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useMultiChainRegContractList } from "@3rdweb-sdk/react/hooks/useRegistry";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { defineChain, getContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { useActiveAccount } from "thirdweb/react";
import {
  DEFAULT_ACCOUNT_FACTORY_V0_6,
  DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";
import { TWTable } from "../../shared/TWTable";
import { FactoryContracts } from "./factory-contracts";

function useFactories() {
  const address = useActiveAccount()?.address;
  const client = useThirdwebClient();
  const contractListQuery = useMultiChainRegContractList(address);

  return useQuery({
    queryKey: [
      "dashboard-registry",
      address,
      "multichain-contract-list",
      "factories",
    ],
    queryFn: async () => {
      const factories = await Promise.all(
        (contractListQuery.data || []).map(async (c) => {
          const contract = getContract({
            // eslint-disable-next-line no-restricted-syntax
            chain: defineChain(c.chainId),
            address: c.address,
            client,
          });
          const m = await getCompilerMetadata(contract);
          return m.name.indexOf("AccountFactory") > -1 ? c : null;
        }),
      );

      return factories.filter((f) => f !== null);
    },
    enabled: !!address && !!contractListQuery.data,
  });
}

interface AccountFactoriesProps {
  trackingCategory: string;
}

export const AccountFactories: React.FC<AccountFactoriesProps> = ({
  trackingCategory,
}) => {
  const factories = useFactories();
  return (
    <div className="flex flex-col gap-4">
      {/* Default factories */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">Default Account Factories</h3>
        <p className="text-muted-foreground text-sm">
          Ready to use account factories that are pre-deployed on each chain.{" "}
          <a
            href="https://playground.thirdweb.com/connect/account-abstraction/connect"
            className="text-link-foreground"
            target="_blank"
            rel="noreferrer"
          >
            Learn how to use these in your apps.
          </a>
        </p>
      </div>
      <TWTable
        title="default account factories"
        data={[
          {
            name: "AccountFactory (v0.6)",
            address: DEFAULT_ACCOUNT_FACTORY_V0_6,
            entrypointVersion: "0.6",
          },
          {
            name: "AccountFactory (v0.7)",
            address: DEFAULT_ACCOUNT_FACTORY_V0_7,
            entrypointVersion: "0.7",
          },
        ]}
        columns={columns}
        isPending={false}
        isFetched={true}
      />

      {/* Your factories */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">Your Account Factories</h3>
          <p className="text-muted-foreground text-sm">
            Deploy your own account factories to create smart wallets.{" "}
            <a
              href="https://portal.thirdweb.com/connect/account-abstraction/factories"
              className="text-link-foreground"
              target="_blank"
              rel="noreferrer"
            >
              Learn more.
            </a>
          </p>
        </div>

        <Button variant="default" asChild size="sm">
          <TrackedLinkTW
            category={trackingCategory}
            label="create-factory"
            href="/explore/smart-wallet"
            className="gap-2 text-sm"
          >
            <PlusIcon className="size-3" />
            Deploy Account Factory
          </TrackedLinkTW>
        </Button>
      </div>

      <FactoryContracts
        contracts={factories.data || []}
        isPending={factories.isPending}
        isFetched={factories.isFetched}
      />
    </div>
  );
};

type DefaultFactory = {
  name: string;
  address: string;
  entrypointVersion: string;
};

const columnHelper = createColumnHelper<DefaultFactory>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    header: "Name",
    cell: (cell) => cell.row.original.name,
  }),
  columnHelper.accessor((row) => row.name, {
    header: "Network",
    cell: () => "All networks",
  }),
  columnHelper.accessor("address", {
    header: "Contract address",
    cell: (cell) => (
      <CopyAddressButton
        address={cell.getValue()}
        copyIconPosition="left"
        variant="ghost"
        className="-translate-x-2"
      />
    ),
  }),
  columnHelper.accessor((row) => row, {
    header: "Entrypoint Version",
    cell: (cell) => {
      return cell.row.original.entrypointVersion;
    },
  }),
];
