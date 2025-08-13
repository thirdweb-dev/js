"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { NATIVE_TOKEN_ADDRESS, type ThirdwebContract } from "thirdweb";
import { getAllRecipientsPercentages } from "thirdweb/extensions/split";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Button } from "@/components/ui/button";
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
import { useOwnedTokenBalances } from "@/hooks/useSplit";
import { DistributeButton } from "./components/distribute-button";

export function ContractSplitPage({
  contract,
  isLoggedIn,
}: {
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}) {
  const address = useActiveAccount()?.address;

  const allRecipientsPercentagesQuery = useReadContract(
    getAllRecipientsPercentages,
    { contract },
  );
  const balanceQuery = useOwnedTokenBalances({
    ownerAddress: contract.address, // fetch the balance of split contract
    client: contract.client,
    chain: contract.chain,
  });

  const activeRecipient = (allRecipientsPercentagesQuery.data || []).find(
    (r) => r.address.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Balances</h2>
        <p className="text-muted-foreground">
          The Split can receive funds in the native token or in any ERC20
        </p>
      </div>

      {/* balances table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <TableContainer className="border-none rounded-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px] lg:w-[320px]">Token</TableHead>
                <TableHead>Balance</TableHead>
                {activeRecipient && <TableHead>Your Share</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceQuery.isPending
                ? new Array(3).fill(null).map((_, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: ok
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-5 w-52" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      {activeRecipient && (
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                : balanceQuery.data?.map((tokenBalance) => (
                    <TableRow key={tokenBalance.tokenAddress}>
                      {/* token  */}
                      <TableCell className="font-medium">
                        <Button
                          asChild
                          variant="ghost"
                          className="flex items-center gap-2 w-fit h-auto py-1 px-2 -translate-x-2"
                        >
                          {tokenBalance.tokenAddress ===
                          NATIVE_TOKEN_ADDRESS ? (
                            <span>{tokenBalance.symbol}</span>
                          ) : (
                            <Link
                              href={`https://thirdweb.com/${tokenBalance.chainId}/${tokenBalance.tokenAddress}`}
                              target="_blank"
                            >
                              {tokenBalance.name}
                              <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
                            </Link>
                          )}
                        </Button>
                      </TableCell>

                      {/* balance */}
                      <TableCell>
                        {tokenBalance.displayValue} {tokenBalance.symbol}
                      </TableCell>

                      {/* your share percent */}
                      {activeRecipient && (
                        <TableCell>
                          {activeRecipient.splitPercentage}%
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>

          {balanceQuery.isError && (
            <div className="text-red-500 px-4 flex justify-center items-center py-20 text-muted-foreground">
              {balanceQuery.error.message}
            </div>
          )}

          {!balanceQuery.isPending && balanceQuery.data?.length === 0 && (
            <div className="px-4 flex justify-center items-center py-20 text-muted-foreground">
              No funds received yet
            </div>
          )}
        </TableContainer>

        {balanceQuery.data && balanceQuery.data.length > 0 && (
          <div className="border-t p-4 lg:py-5 lg:px-6 flex justify-end bg-card">
            <DistributeButton
              balances={balanceQuery.data || []}
              balancesIsError={balanceQuery.isError}
              balancesIsPending={balanceQuery.isPending}
              contract={contract}
              isLoggedIn={isLoggedIn}
            />
          </div>
        )}
      </div>

      <div className="h-10" />

      <div className="mb-4">
        <h3 className="text-2xl font-semibold tracking-tight">
          Split Recipients
        </h3>
        <p className="text-muted-foreground">
          List of addresses that can receive funds from the Split and their
          percentage share.
        </p>
      </div>

      {/* recipients table */}
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[240px] lg:w-[320px]">Address</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allRecipientsPercentagesQuery.isPending
              ? new Array(3).fill(null).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-52" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              : (allRecipientsPercentagesQuery.data || []).map((split) => (
                  <TableRow key={split.address}>
                    <TableCell>
                      <WalletAddress
                        address={split.address}
                        client={contract.client}
                        className="h-auto py-1"
                      />
                    </TableCell>
                    <TableCell>{split.splitPercentage}%</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
