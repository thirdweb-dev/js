"use client";

import { useQuery } from "@tanstack/react-query";
import type { ThirdwebClient } from "thirdweb";
import { getChainMetadata } from "thirdweb/chains";
import type { ProjectContract } from "@/api/getProjectContracts";
import { ContractNameCell } from "@/components/contract-components/tables/cells";
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
import { useV5DashboardChain } from "@/hooks/chains/v5-adapter";
import { FactoryAccountCell } from "./account-cell";

interface FactoryContractsProps {
  contracts: ProjectContract[];
  isPending: boolean;
  isFetched: boolean;
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
}

function NetworkName(props: { id: number }) {
  const chain = useV5DashboardChain(props.id);
  const chainQuery = useQuery({
    queryFn: () => getChainMetadata(chain),
    queryKey: ["getChainByChainIdAsync", props.id],
  });

  return (
    <SkeletonContainer
      className="inline-block"
      loadedData={chainQuery.data?.name}
      render={(v) => {
        return <p className="text-muted-foreground text-sm">{v}</p>;
      }}
      skeletonData="Ethereum Mainnet"
    />
  );
}

export const FactoryContracts: React.FC<FactoryContractsProps> = ({
  contracts,
  teamSlug,
  projectSlug,
  client,
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
                  client={client}
                  contractAddress={contract.contractAddress}
                  projectSlug={projectSlug}
                  teamSlug={teamSlug}
                />
              </TableCell>
              <TableCell>
                <NetworkName id={Number(contract.chainId)} />
              </TableCell>
              <TableCell>
                <CopyAddressButton
                  address={contract.contractAddress}
                  className="-translate-x-2"
                  copyIconPosition="left"
                  variant="ghost"
                />
              </TableCell>
              <TableCell>
                <FactoryAccountCell
                  chainId={contract.chainId}
                  client={client}
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
