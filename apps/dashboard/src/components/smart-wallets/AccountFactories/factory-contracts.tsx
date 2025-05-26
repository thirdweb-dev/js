"use client";

import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { SkeletonContainer } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ContractNameCell } from "components/contract-components/tables/cells";
import { FactoryAccountCell } from "components/smart-wallets/AccountFactories/account-cell";
import { useV5DashboardChain } from "lib/v5-adapter";
import { getChainMetadata } from "thirdweb/chains";
import type { ProjectContract } from "../../../app/(app)/account/contracts/_components/getProjectContracts";

interface FactoryContractsProps {
  contracts: ProjectContract[];
  isPending: boolean;
  isFetched: boolean;
  teamSlug: string;
  projectSlug: string;
}

function NetworkName(props: { id: number }) {
  const chain = useV5DashboardChain(props.id);
  const chainQuery = useQuery({
    queryKey: ["getChainByChainIdAsync", props.id],
    queryFn: () => getChainMetadata(chain),
  });

  return (
    <SkeletonContainer
      className="inline-block"
      loadedData={chainQuery.data?.name}
      skeletonData="Ethereum Mainnet"
      render={(v) => {
        return <p className="text-muted-foreground text-sm">{v}</p>;
      }}
    />
  );
}

export const FactoryContracts: React.FC<FactoryContractsProps> = ({
  contracts,
  teamSlug,
  projectSlug,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Contract address</TableHead>
            <TableHead>Accounts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.contractAddress + contract.chainId}>
              <TableCell>
                <ContractNameCell
                  chainId={contract.chainId}
                  contractAddress={contract.contractAddress}
                  teamSlug={teamSlug}
                  projectSlug={projectSlug}
                />
              </TableCell>
              <TableCell>
                <NetworkName id={Number(contract.chainId)} />
              </TableCell>
              <TableCell>
                <CopyAddressButton
                  address={contract.contractAddress}
                  copyIconPosition="left"
                  variant="ghost"
                  className="-translate-x-2"
                />
              </TableCell>
              <TableCell>
                <FactoryAccountCell
                  chainId={contract.chainId}
                  contractAddress={contract.contractAddress}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
