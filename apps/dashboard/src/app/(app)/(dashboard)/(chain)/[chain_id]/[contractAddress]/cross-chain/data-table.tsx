"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { verifyContract } from "app/(app)/(dashboard)/(chain)/[chain_id]/[contractAddress]/sources/ContractSourcesPage";
import {
  type DeployModalStep,
  DeployStatusModal,
  useDeployStatusModal,
} from "components/contract-components/contract-deploy-form/deploy-context-modal";
import { useTxNotifications } from "hooks/useTxNotifications";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  defineChain,
  eth_getCode,
  getContract,
  getRpcClient,
  prepareContractCall,
  prepareTransaction,
  sendAndConfirmTransaction,
  type ThirdwebClient,
} from "thirdweb";
import type {
  FetchDeployMetadataResult,
  ThirdwebContract,
} from "thirdweb/contract";
import {
  deployContractfromDeployMetadata,
  getOrDeployInfraForPublishedContract,
} from "thirdweb/deploys";
import { useActiveAccount, useSwitchActiveWalletChain } from "thirdweb/react";
import { concatHex, padHex } from "thirdweb/utils";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToolTipLabel } from "@/components/ui/tooltip";
import type { ProjectMeta } from "../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../_utils/contract-page-path";
import { SingleNetworkSelector } from "./single-network-selector";

type CrossChain = {
  id: number;
  network: string;
  chainId: number;
  status: "DEPLOYED" | "NOT_DEPLOYED";
};

const interopChains = ["420120000", "420120001"];

type ChainId = "420120000" | "420120001";

const formSchema = z.object({
  amounts: z.object({
    "420120000": z.string(),
    "420120001": z.string(),
  }),
});
type FormSchema = z.output<typeof formSchema>;

const positiveIntegerRegex = /^[0-9]\d*$/;
const superchainBridgeAddress = "0x4200000000000000000000000000000000000028";

export function DataTable({
  data,
  coreMetadata,
  coreContract,
  modulesMetadata,
  initializeData,
  inputSalt,
  initCode,
  isDirectDeploy,
  projectMeta,
}: {
  data: CrossChain[];
  coreMetadata: FetchDeployMetadataResult;
  coreContract: ThirdwebContract;
  modulesMetadata?: FetchDeployMetadataResult[];
  initializeData?: `0x${string}`;
  inputSalt?: `0x${string}`;
  initCode?: `0x${string}`;
  isDirectDeploy: boolean;
  projectMeta: ProjectMeta | undefined;
}) {
  const activeAccount = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();
  const deployStatusModal = useDeployStatusModal();
  const { onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  const isCrosschain = !!modulesMetadata?.find(
    (m) => m.name === "SuperChainInterop",
  );

  const client = coreContract.client;
  const addRowMutation = useMutation({
    mutationFn: async (chain: { chainId: number; name: string }) => {
      if (coreContract.chain.id === chain.chainId) {
        return;
      }
      // eslint-disable-next-line no-restricted-syntax
      const c = defineChain(chain.chainId);
      const code = await eth_getCode(
        getRpcClient({
          chain: c,
          client: client,
        }),
        { address: coreContract.address },
      );

      const newRow: CrossChain = {
        chainId: chain.chainId,
        id: chain.chainId,
        network: chain.name,
        status: code?.length > 2 ? "DEPLOYED" : "NOT_DEPLOYED",
      };

      if (!customChainData.some((row) => row.chainId === chain.chainId)) {
        setCustomChainData((prevData) => [...prevData, newRow]);
      }
    },
  });

  const [customChainData, setCustomChainData] = useState<CrossChain[]>(() => {
    try {
      const storedData = window.localStorage.getItem(
        `crosschain-${coreContract.address}`,
      );
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      return [];
    }
  });

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    try {
      window.localStorage.setItem(
        `crosschain-${coreContract.address}`,
        JSON.stringify(customChainData),
      );
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  }, [customChainData, coreContract.address]);

  const mergedChainData = useMemo(() => {
    const chainMap = new Map<number, CrossChain>();
    for (const item of [...data, ...customChainData]) {
      chainMap.set(item.chainId, item); // Deduplicate by chainId
    }
    return Array.from(chainMap.values());
  }, [data, customChainData]);

  const form = useForm<FormSchema>({
    defaultValues: {
      amounts: {
        "420120000": "",
        "420120001": "",
      },
    },
    resolver: zodResolver(formSchema),
  });

  const crossChainTransfer = async (chainId: ChainId) => {
    if (!activeAccount) {
      throw new Error("Account not connected");
    }
    const amount = form.getValues().amounts[chainId];
    if (!positiveIntegerRegex.test(amount)) {
      form.setError(`amounts.${chainId}`, { message: "Invalid Amount" });
      return;
    }

    const superChainBridge = getContract({
      address: superchainBridgeAddress,
      chain: coreContract.chain,
      client: coreContract.client,
    });

    const sendErc20Tx = prepareContractCall({
      contract: superChainBridge,
      method:
        "function sendERC20(address _token, address _to, uint256 _amount, uint256 _chainId)",
      params: [
        coreContract.address,
        activeAccount.address,
        BigInt(amount),
        BigInt(chainId),
      ],
    });

    await sendAndConfirmTransaction({
      account: activeAccount,
      transaction: sendErc20Tx,
    });
  };

  const crossChainTransferNotifications = useTxNotifications(
    "Successfully submitted cross chain transfer",
    "Failed to submit cross chain transfer",
  );

  const crossChainTransferMutation = useMutation({
    mutationFn: crossChainTransfer,
    onError: crossChainTransferNotifications.onError,
    onSuccess: crossChainTransferNotifications.onSuccess,
  });

  const columns: ColumnDef<CrossChain>[] = [
    {
      accessorKey: "network",
      cell: ({ row }) => {
        if (row.getValue("status") === "DEPLOYED") {
          const href = buildContractPagePath({
            chainIdOrSlug: `${row.getValue("chainId")}`,
            contractAddress: coreContract.address,
            projectMeta,
          });

          return (
            <Link
              className="text-blue-500 underline"
              href={href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {row.getValue("network")}
            </Link>
          );
        }
        return row.getValue("network");
      },
      header: "Network",
    },
    {
      accessorKey: "chainId",
      header: "Chain ID",
    },
    {
      accessorKey: "status",
      cell: ({ row }) => {
        if (row.getValue("status") === "DEPLOYED") {
          return <p>Deployed</p>;
        }
        return (
          <Button
            onClick={() => deployContract(row.getValue("chainId"), client)}
            type="button"
          >
            Deploy
          </Button>
        );
      },
      header: "Status",
    },
    {
      accessorKey: "transfer",
      cell: ({ row }) => {
        const chain = row.getValue("chainId");
        if (
          row.getValue("status") === "DEPLOYED" &&
          interopChains.includes(String(chain)) &&
          isCrosschain
        ) {
          return (
            <FormField
              control={form.control}
              disabled={false}
              name={`amounts.${row.getValue("chainId") as ChainId}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ToolTipLabel label="Bridge tokens">
                      <div className="flex">
                        <Input
                          className="w-22 rounded-r-none border-r-0"
                          placeholder="amount"
                          {...field}
                        />
                        <Button
                          className="rounded-lg rounded-l-none border border-l-0"
                          disabled={false}
                          onClick={() =>
                            crossChainTransferMutation.mutate(
                              row.getValue("chainId"),
                            )
                          }
                          type="button"
                        >
                          Bridge
                        </Button>
                      </div>
                    </ToolTipLabel>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }
      },
      header: "",
    },
  ];

  const table = useReactTable({
    columns,
    data: mergedChainData,
    getCoreRowModel: getCoreRowModel(),
  });

  const deployContract = async (chainId: number, client: ThirdwebClient) => {
    try {
      if (!activeAccount) {
        throw new Error("No active account");
      }

      // eslint-disable-next-line no-restricted-syntax
      const chain = defineChain(chainId);
      const salt =
        inputSalt || concatHex(["0x03", padHex("0x", { size: 31 })]).toString();

      await switchChain(chain);

      const steps: DeployModalStep[] = [
        {
          signatureCount: 1,
          type: "deploy",
        },
      ];

      deployStatusModal.setViewContractLink("");
      deployStatusModal.open(steps);

      let crosschainContractAddress: string | undefined;
      if (initCode && isDirectDeploy) {
        const tx = prepareTransaction({
          chain,
          client,
          data: initCode,
          to: "0x4e59b44847b379578588920cA78FbF26c0B4956C",
        });

        await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: tx,
        });

        const code = await eth_getCode(
          getRpcClient({
            chain,
            client,
          }),
          {
            address: coreContract.address,
          },
        );

        if (code && code.length > 2) {
          crosschainContractAddress = coreContract.address;
        }
      } else {
        if (modulesMetadata) {
          for (const m of modulesMetadata) {
            await getOrDeployInfraForPublishedContract({
              account: activeAccount,
              chain,
              client,
              contractId: m.name,
              publisher: m.publisher,
            });
          }
        }

        crosschainContractAddress = await deployContractfromDeployMetadata({
          account: activeAccount,
          chain,
          client,
          deployMetadata: coreMetadata,
          initializeData,
          isCrosschain: true,
          salt,
        });

        verifyContract({
          address: crosschainContractAddress as `0x${string}`,
          chain,
          client,
        });
      }
      deployStatusModal.nextStep();

      if (crosschainContractAddress) {
        const contractLink = buildContractPagePath({
          chainIdOrSlug: `${chain.id}`,
          contractAddress: crosschainContractAddress,
          projectMeta,
        });

        deployStatusModal.setViewContractLink(contractLink);
      }

      deployStatusModal.close();

      setCustomChainData((prevData) =>
        prevData.map((row) =>
          row.chainId === chainId ? { ...row, status: "DEPLOYED" } : row,
        ),
      );
    } catch (e) {
      onError(e);
      console.error("failed to deploy contract", e);
      deployStatusModal.close();
    }
  };

  return (
    <Form {...form}>
      <form>
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <TableContainer>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DeployStatusModal deployStatusModal={deployStatusModal} />
          </TableContainer>
        </div>

        {addRowMutation.isPending && (
          <div className="my-4 animate-pulse text-center text-blue-500">
            Processing...
          </div>
        )}

        {addRowMutation.isError && (
          <div className="my-4 text-center text-red-500">
            Error while adding selected chain!
          </div>
        )}

        <div className="mt-4">
          <SingleNetworkSelector
            className="w-full"
            client={client}
            isAddingRow={addRowMutation.isPending}
            onAddRow={addRowMutation.mutate}
          />
        </div>
      </form>
    </Form>
  );
}
