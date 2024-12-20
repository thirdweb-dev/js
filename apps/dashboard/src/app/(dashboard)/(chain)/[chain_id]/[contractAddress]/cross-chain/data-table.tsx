"use client";

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
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { verifyContract } from "app/(dashboard)/(chain)/[chain_id]/[contractAddress]/sources/ContractSourcesPage";
import {
  type DeployModalStep,
  DeployStatusModal,
  useDeployStatusModal,
} from "components/contract-components/contract-deploy-form/deploy-context-modal";
import {
  getModuleInstallParams,
  showPrimarySaleFiedset,
  showRoyaltyFieldset,
  showSuperchainBridgeFieldset,
} from "components/contract-components/contract-deploy-form/modular-contract-default-modules-fieldset";
import { useTxNotifications } from "hooks/useTxNotifications";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  ZERO_ADDRESS,
  defineChain,
  eth_getTransactionCount,
  getContract,
  getRpcClient,
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import type {
  FetchDeployMetadataResult,
  ThirdwebContract,
} from "thirdweb/contract";
import { deployContractfromDeployMetadata } from "thirdweb/deploys";
import { installPublishedModule } from "thirdweb/modules";
import { useActiveAccount, useSwitchActiveWalletChain } from "thirdweb/react";
import {
  type AbiFunction,
  concatHex,
  encodeAbiParameters,
  padHex,
} from "thirdweb/utils";
import { z } from "zod";

type CrossChain = {
  id: number;
  network: string;
  chainId: number;
  status: "DEPLOYED" | "NOT_DEPLOYED";
};

type ChainId = "84532" | "11155420" | "919" | "111557560" | "999999999";

const formSchema = z.object({
  amounts: z.object({
    "84532": z.string(),
    "11155420": z.string(),
    "919": z.string(),
    "111557560": z.string(),
    "999999999": z.string(),
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
}: {
  data: CrossChain[];
  coreMetadata: FetchDeployMetadataResult;
  coreContract: ThirdwebContract;
  modulesMetadata: FetchDeployMetadataResult[];
  initializeData?: `0x${string}`;
}) {
  const activeAccount = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();
  const deployStatusModal = useDeployStatusModal();
  const { onError } = useTxNotifications(
    "Successfully deployed contract",
    "Failed to deploy contract",
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      amounts: {
        "84532": "", // Base
        "11155420": "", // OP testnet
        "919": "", // Mode Network
        "111557560": "", // Cyber
        "999999999": "", // Zora
      },
    },
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
    onSuccess: crossChainTransferNotifications.onSuccess,
    onError: crossChainTransferNotifications.onError,
  });

  const columns: ColumnDef<CrossChain>[] = [
    {
      accessorKey: "network",
      header: "Network",
      cell: ({ row }) => {
        if (row.getValue("status") === "DEPLOYED") {
          return (
            <Link
              target="_blank"
              className="text-blue-500 underline"
              href={`/${row.getValue("chainId")}/${coreContract.address}`}
            >
              {row.getValue("network")}
            </Link>
          );
        }
        return row.getValue("network");
      },
    },
    {
      accessorKey: "chainId",
      header: "Chain ID",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        if (row.getValue("status") === "DEPLOYED") {
          return (
            <FormField
              disabled // TODO: undo once the OP interop upgrade goes through
              control={form.control}
              name={`amounts.${row.getValue("chainId") as ChainId}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ToolTipLabel label="Coming soon">
                      <div className="flex">
                        <Input
                          className="w-22 rounded-r-none border-r-0"
                          placeholder="amount"
                          {...field}
                        />
                        <Button
                          type="button"
                          disabled
                          onClick={() =>
                            crossChainTransferMutation.mutate(
                              row.getValue("chainId"),
                            )
                          }
                          className="rounded-lg rounded-l-none border border-l-0"
                        >
                          Transfer
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
        return (
          <Button
            type="button"
            onClick={() => deployContract(row.getValue("chainId"))}
          >
            Deploy
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const deployContract = async (chainId: number) => {
    try {
      if (!activeAccount) {
        throw new Error("No active account");
      }

      // eslint-disable-next-line no-restricted-syntax
      const chain = defineChain(chainId);
      const client = getThirdwebClient();
      const salt = concatHex(["0x0101", padHex("0x", { size: 30 })]).toString();

      await switchChain(chain);

      const steps: DeployModalStep[] = [
        {
          type: "deploy",
          signatureCount: 1,
        },
      ];

      deployStatusModal.setViewContractLink("");
      deployStatusModal.open(steps);

      const isCrosschain = !!modulesMetadata?.find(
        (m) => m.name === "SuperChainInterop",
      );

      const crosschainContractAddress = await deployContractfromDeployMetadata({
        account: activeAccount,
        chain,
        client,
        deployMetadata: coreMetadata,
        isCrosschain,
        initializeData,
        salt,
      });

      await verifyContract({
        address: crosschainContractAddress,
        chain,
        client,
      });

      if (isCrosschain) {
        const owner = await readContract({
          contract: coreContract,
          method: "function owner() view returns (address)",
          params: [],
        });

        const moduleInitializeParams = modulesMetadata.reduce(
          (acc, mod) => {
            const params = getModuleInstallParams(mod);
            const paramNames = params
              .map((param) => param.name)
              .filter((p) => p !== undefined);
            const returnVal: Record<string, string> = {};

            // set connected wallet address as default "royaltyRecipient"
            if (showRoyaltyFieldset(paramNames)) {
              returnVal.royaltyRecipient = owner || "";
              returnVal.royaltyBps = "0";
              returnVal.transferValidator = ZERO_ADDRESS;
            }

            // set connected wallet address as default "primarySaleRecipient"
            else if (showPrimarySaleFiedset(paramNames)) {
              returnVal.primarySaleRecipient = owner || "";
            }

            // set superchain bridge address
            else if (showSuperchainBridgeFieldset(paramNames)) {
              returnVal.superchainBridge =
                "0x4200000000000000000000000000000000000028"; // OP Superchain Bridge
            }

            acc[mod.name] = returnVal;
            return acc;
          },
          {} as Record<string, Record<string, string>>,
        );

        const moduleDeployData = modulesMetadata.map((m) => ({
          deployMetadata: m,
          initializeParams: moduleInitializeParams[m.name],
        }));

        const contract = getContract({
          address: crosschainContractAddress,
          chain,
          client,
        });

        const rpcRequest = getRpcClient({
          client,
          chain,
        });
        const currentNonce = await eth_getTransactionCount(rpcRequest, {
          address: activeAccount.address,
        });

        for (const [i, m] of moduleDeployData.entries()) {
          let moduleData: `0x${string}` | undefined;

          const moduleInstallParams = m.deployMetadata.abi.find(
            (abiType) =>
              (abiType as AbiFunction).name === "encodeBytesOnInstall",
          ) as AbiFunction | undefined;

          if (m.initializeParams && moduleInstallParams) {
            moduleData = encodeAbiParameters(
              (
                moduleInstallParams.inputs as { name: string; type: string }[]
              ).map((p) => ({
                name: p.name,
                type: p.type,
              })),
              Object.values(m.initializeParams),
            );
          }

          const installTransaction = installPublishedModule({
            contract,
            account: activeAccount,
            moduleName: m.deployMetadata.name,
            publisher: m.deployMetadata.publisher,
            version: m.deployMetadata.version,
            moduleData,
            nonce: currentNonce + i,
          });

          const txResult = await sendTransaction({
            transaction: installTransaction,
            account: activeAccount,
          });

          await waitForReceipt(txResult);
          // can't handle parallel transactions, so wait a bit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      deployStatusModal.nextStep();
      deployStatusModal.setViewContractLink(
        `/${chain.id}/${crosschainContractAddress}`,
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      </form>
    </Form>
  );
}
