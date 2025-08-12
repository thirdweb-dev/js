import Link from "next/link";
import { fetchDeployMetadata } from "@/api/contract/fetchDeployMetadata";
import { ContractIdImage } from "@/components/contract-components/shared/contract-id-image";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";

type DeployableContractTableProps = {
  contractIds: string[];
  context: "deploy" | "publish";
};

export async function DeployableContractTable(
  props: DeployableContractTableProps,
) {
  const { contractIds, context } = props;
  const deployedContractMetadata = await Promise.all(
    contractIds.map(async (id) => {
      const res = await fetchDeployMetadata(id, serverThirdwebClient);
      return {
        contractId: id,
        ...res,
      };
    }),
  ).catch(() => null);

  if (!deployedContractMetadata) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border">
        Failed to load deploy metadata for all contracts
      </div>
    );
  }

  const showDescriptionCell = context === "publish";
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            {showDescriptionCell && <TableHead>Description</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody className="relative">
          {deployedContractMetadata.map((metadata, i) => {
            return (
              <TableRow
                className="cursor-pointer hover:bg-card"
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                linkBox
              >
                {/* Icon */}
                <TableCell>
                  <ContractIdImage deployedMetadataResult={metadata} />
                </TableCell>

                {/* name */}
                <TableCell>
                  <Link
                    className="text-left text-muted-foreground before:absolute before:inset-0"
                    href={`/contracts/${context}/${encodeURIComponent(metadata.contractId)}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {metadata.name}
                  </Link>
                </TableCell>

                {showDescriptionCell && (
                  <TableCell>
                    {
                      <span className="line-clamp-1 text-muted-foreground">
                        {metadata.description || "First Version"}
                      </span>
                    }
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
