"use client";

import { useMemo } from "react";
import {
  type ThirdwebContract,
  toEther,
  toTokens,
  ZERO_ADDRESS,
} from "thirdweb";
import { getAllRecipientsPercentages } from "thirdweb/extensions/split";
import {
  useActiveAccount,
  useReadContract,
  useWalletBalance,
} from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllChainsData } from "@/hooks/chains/allChains";
import { useSplitBalances } from "@/hooks/useSplit";
import { shortenIfAddress } from "@/utils/usedapp-external";
import { DistributeButton } from "./components/distribute-button";

export type Balance = {
  name: string;
  token_address: string;
  balance: string;
  display_balance: string;
  decimals: number;
};

interface SplitPageProps {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

export function ContractSplitPage({ contract, isLoggedIn }: SplitPageProps) {
  const address = useActiveAccount()?.address;
  const { idToChain } = useAllChainsData();
  const chainId = contract.chain.id;
  const v4Chain = idToChain.get(chainId);
  const contractAddress = contract.address;
  const nativeBalanceQuery = useWalletBalance({
    address: contractAddress,
    chain: contract.chain,
    client: contract.client,
  });
  const { data: allRecipientsPercentages } = useReadContract(
    getAllRecipientsPercentages,
    { contract },
  );
  const balanceQuery = useSplitBalances(contract);
  const balances = useMemo(() => {
    if (!balanceQuery.data && !nativeBalanceQuery.data) {
      return [];
    }

    return [
      {
        balance: nativeBalanceQuery?.data?.value?.toString() || "0",
        decimals: nativeBalanceQuery?.data?.decimals || 18,
        display_balance: nativeBalanceQuery?.data?.displayValue || "0.0",
        name: "Native Token",
        token_address: ZERO_ADDRESS,
      },
      ...(balanceQuery.data || []).filter((bl) => bl.name !== "Native Token"),
    ];
  }, [balanceQuery.data, nativeBalanceQuery.data]);

  const shareOfBalancesForConnectedWallet = useMemo(() => {
    const activeRecipient = (allRecipientsPercentages || []).find(
      (r) => r.address.toLowerCase() === address?.toLowerCase(),
    );
    if (!activeRecipient || !balances) {
      return {};
    }

    return balances.reduce(
      (acc, curr) => {
        // For native token balance, Moralis returns the zero address
        // this logic will potentially have to change if we decide to replace the service
        const isNativeToken = curr.token_address === ZERO_ADDRESS;
        const displayBalance = isNativeToken
          ? toEther(BigInt(curr.balance))
          : toTokens(BigInt(curr.balance), curr.decimals);
        return {
          // biome-ignore lint/performance/noAccumulatingSpread: FIXME
          ...acc,
          [curr.token_address]: displayBalance,
        };
      },
      {} as { [address: string]: string },
    );
  }, [allRecipientsPercentages, balances, address]);

  const isPending = balanceQuery.isPending || nativeBalanceQuery.isPending;

  return (
    <div>
      {/* header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center justify-between mb-6 lg:mb-3">
        <h2 className="text-2xl font-semibold tracking-tight">Balances</h2>
        <DistributeButton
          balances={balances as Balance[]}
          balancesIsError={balanceQuery.isError && nativeBalanceQuery.isError}
          balancesIsPending={
            balanceQuery.isPending || nativeBalanceQuery.isPending
          }
          contract={contract}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* balances */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {isPending ? (
            new Array(4).fill(null).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: ok
              <Skeleton key={index} className="h-[86px]" />
            ))
          ) : (
            <>
              <BalanceCard
                symbol={nativeBalanceQuery.data?.symbol || "Native Token"}
                displayValue={nativeBalanceQuery?.data?.displayValue || "0"}
                userShare={shareOfBalancesForConnectedWallet[ZERO_ADDRESS]}
              />

              {(balanceQuery?.data || [])
                ?.filter((bl) => bl.name !== "Native Token")
                ?.map((balance) => (
                  <BalanceCard
                    key={balance.token_address}
                    symbol={
                      balance.name === "Native Token"
                        ? v4Chain?.nativeCurrency.symbol || "Native Token"
                        : balance.symbol ||
                          shortenIfAddress(balance.token_address)
                    }
                    displayValue={balance.display_balance}
                    userShare={
                      shareOfBalancesForConnectedWallet[balance.token_address]
                    }
                  />
                ))}
            </>
          )}
        </div>

        {balanceQuery.isError && (
          <p className="text-red-500">
            {(balanceQuery?.error as Error).message === "Invalid chain!"
              ? "Showing ERC20 balances for this network is not currently supported. You can distribute ERC20 funds from the Explorer tab."
              : "Error loading balances"}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          The Split can receive funds in the native token or in any ERC20.
          Balances may take a couple of minutes to display after being received.
          <br />
          {/* We currently use Moralis and high chances are they don't recognize all ERC20 tokens in the contract */}
          If you are looking to distribute an ERC20 token and it's not being
          recognized on this page, you can manually call the `distribute` method
          in the Explorer page
        </p>
      </div>

      {/* recipients e */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Split Recipients</h3>
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(allRecipientsPercentages || []).map((split) => (
                <TableRow key={split.address}>
                  <TableCell>
                    <WalletAddress
                      address={split.address}
                      client={contract.client}
                    />
                  </TableCell>
                  <TableCell>{split.splitPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

function BalanceCard(props: {
  symbol: string;
  displayValue: string;
  userShare: string | undefined;
}) {
  return (
    <div className="p-4 border rounded-lg bg-card space-y-1">
      <div className="text-xl font-semibold">
        {props.displayValue} {props.symbol}
      </div>
      {props.userShare && (
        <div className="text-sm">
          <span className="text-sm font-medium">Your Share:</span>{" "}
          {props.userShare}
        </div>
      )}
    </div>
  );
}
