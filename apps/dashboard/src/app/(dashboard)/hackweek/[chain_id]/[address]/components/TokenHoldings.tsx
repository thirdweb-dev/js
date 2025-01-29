import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabButtons } from "@/components/ui/tabs";
import { useState } from "react";
import { toTokens } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import type { TokenDetails } from "../hooks/useGetERC20Tokens";
import type { NFTDetails } from "../hooks/useGetNFTs";
import { NFTCard } from "./NFTCard";

interface TokenHoldingsProps {
  chain: ChainMetadata;
  tokens: TokenDetails[];
  nfts: NFTDetails[];
  isLoading: boolean;
}

export function TokenHoldings({
  chain,
  tokens,
  nfts,
  isLoading,
}: TokenHoldingsProps) {
  const [activeTab, setActiveTab] = useState<"erc20" | "nft">("erc20");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <TabButtons
          tabs={[
            {
              name: "ERC20 Tokens",
              isActive: activeTab === "erc20",
              isEnabled: true,
              onClick: () => setActiveTab("erc20"),
            },
            {
              name: "NFTs",
              isActive: activeTab === "nft",
              isEnabled: true,
              onClick: () => setActiveTab("nft"),
            },
          ]}
          tabClassName="font-medium !text-sm"
        />

        {isLoading ? (
          <Spinner />
        ) : activeTab === "erc20" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <Spinner />
              ) : (
                tokens.map((token, idx) => (
                  <TableRow key={`${token.name}-${idx}`}>
                    <TableCell>
                      {token.symbol} ({token.name})
                    </TableCell>
                    <TableCell>
                      {toTokens(BigInt(token.balance), token.decimals)}
                    </TableCell>
                    <TableCell>
                      ${token.totalValueUsdString ?? "0.00"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : activeTab === "nft" ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {nfts.map((nft, idx) => (
              <NFTCard
                key={`${nft.contractAddress}-${idx}`}
                nft={nft}
                chain={chain}
              />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
