"use client";

import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAllChainsData } from "hooks/chains/allChains";
import { InfoIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebContract,
  eth_getBalance,
  getContract,
  getRpcClient,
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { getBalance, getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { useActiveAccount } from "thirdweb/react";
import { CurrencySelector } from "../modules/components/CurrencySelector";

export function ClaimFeesCard(props: {
  splitWallet: string;
  recipients: string[];
  allocations: bigint[];
  controller: string;
  splitFeesCore: ThirdwebContract;
}) {
  const { idToChain } = useAllChainsData();
  const chain = idToChain.get(props.splitFeesCore.chain.id);
  const account = useActiveAccount();
  const form = useForm<{ currencyAddress: string }>({
    values: {
      currencyAddress: NATIVE_TOKEN_ADDRESS,
    },
  });

  const currencyAddress = form.watch("currencyAddress");
  const currencyMetadata = useQuery({
    queryKey: ["currencyMetadata", currencyAddress],
    queryFn: async () => {
      const erc20Contract = getContract({
        address: currencyAddress,
        client: props.splitFeesCore.client,
        chain: props.splitFeesCore.chain,
      });
      return getCurrencyMetadata({
        contract: erc20Contract,
      });
    },
    enabled: currencyAddress !== NATIVE_TOKEN_ADDRESS,
  });

  const claimAmounts = useQuery({
    queryKey: ["claimAmounts", currencyAddress],
    queryFn: async () => {
      const erc6909Balances = await Promise.all(
        props.recipients.map(async (recipient) =>
          readContract({
            contract: props.splitFeesCore,
            method:
              "function balanceOf(address owner, uint256 id) returns (uint256 amount)",
            params: [recipient, BigInt(currencyAddress)],
          }),
        ),
      );
      console.log("erc6909Balances: ", erc6909Balances);

      let splitWalletBalance: bigint;
      if (currencyAddress === NATIVE_TOKEN_ADDRESS) {
        const rpcRequest = getRpcClient({
          client: props.splitFeesCore.client,
          chain: props.splitFeesCore.chain,
        });
        splitWalletBalance = await eth_getBalance(rpcRequest, {
          address: props.splitWallet,
        });
      } else {
        const { value } = await getBalance({
          contract: props.splitFeesCore,
          address: currencyAddress,
        });
        splitWalletBalance = value;
      }
      console.log("splitWalletBalance: ", splitWalletBalance);

      const totalAllocation = props.allocations.reduce(
        (acc, curr) => acc + curr,
        0n,
      );
      console.log("totalAllocation: ", totalAllocation);
      const claimAmounts = erc6909Balances.map(
        (balance, i) =>
          ((props.allocations[i] || 0n) * splitWalletBalance) /
            totalAllocation +
          balance,
      );
      console.log("claimAmounts: ", claimAmounts);

      return claimAmounts;
    },
  });

  const claim = async (recipient: string) => {
    if (!account) {
      throw new Error("Account does not exist");
    }
    const splitWallet = getContract({
      address: props.splitWallet,
      client: props.splitFeesCore.client,
      chain: props.splitFeesCore.chain,
    });
    const { value: splitWalletBalance } = await getBalance({
      contract: splitWallet,
      address: currencyAddress,
    });
    if (splitWalletBalance > 0n) {
      const distributeTx = prepareContractCall({
        contract: props.splitFeesCore,
        method: "function distribute(address _splitWallet, address _token)",
        params: [props.splitWallet, currencyAddress],
      });
      await sendAndConfirmTransaction({
        account,
        transaction: distributeTx,
      });
    }

    const withdrawTx = prepareContractCall({
      contract: props.splitFeesCore,
      method: "function withdraw(address account, address _token)",
      params: [recipient, currencyAddress],
    });
    await sendAndConfirmTransaction({
      account,
      transaction: withdrawTx,
    });
  };

  const columns = useMemo<
    ColumnDef<{ recipient: string; claimable: bigint; claim: string }>[]
  >(
    () => [
      {
        accessorKey: "recipient",
        header: "Recipient",
      },
      {
        accessorKey: "claimable",
        header: "Claimable Amount",
        cell: ({ row }) => {
          if (
            currencyAddress !== NATIVE_TOKEN_ADDRESS &&
            !currencyMetadata.data
          )
            return null;
          if (currencyAddress === NATIVE_TOKEN_ADDRESS) {
            return (
              <p>{(row.getValue("claimable") as bigint) / 10n ** 18n} ETH</p>
            );
          }

          return (
            <p>
              {(row.getValue("claimable") as bigint) /
                10n ** BigInt(currencyMetadata.data?.decimals || 0n)}{" "}
              {currencyMetadata.data?.symbol}
            </p>
          );
        },
      },
      {
        accessorKey: "claim",
        header: "Claim",
        cell: ({ row }) => {
          return (
            <Button
              onClick={() => claim(row.getValue("recipient"))}
              disabled={row.getValue("claimable") === 0n}
            >
              Claim
            </Button>
          );
        },
      },
    ],
    [],
  );

  const data = useMemo(() => {
    return props.recipients.map((recipient, i) => ({
      recipient,
      claimable: claimAmounts?.data?.[i] ?? 0n,
      claim: "", // dummy value for react-table
    }));
  }, [props.recipients, claimAmounts.data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section className="rounded-lg border border-border bg-muted/50">
      {/* Header */}
      <div className="relative p-4 lg:p-6">
        {/* Title */}
        <div className="pr-14">
          <h3 className="mb-1 gap-2 font-semibold text-xl tracking-tight">
            Split Fees
            {/* Info Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 h-auto w-auto p-2 text-muted-foreground"
                >
                  <InfoIcon className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Split Fees Contract</DialogTitle>
                  <DialogDescription>
                    This contract holds the funds that are split between the
                    recipients.
                  </DialogDescription>

                  {/* Avoid adding focus on other elements to prevent tooltips from opening on modal open */}
                  <input className="sr-only" aria-hidden />

                  <div className="h-2" />

                  <div className="flex flex-col gap-4">
                    <div>
                      <p className="mb-1 text-muted-foreground text-sm">
                        Split Fees
                      </p>
                      <CopyAddressButton
                        className="text-xs"
                        address={props.splitWallet}
                        copyIconPosition="left"
                        variant="outline"
                      />
                    </div>

                    <div>
                      <p className="text-muted-foreground text-sm">
                        Controller
                      </p>
                      <WalletAddress address={props.controller} />
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </h3>
        </div>

        <div className="h-2" />

        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="currencyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <CurrencySelector chain={chain} field={field} />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="h-5" />

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
        </TableContainer>
      </div>
    </section>
  );
}
