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
import { formatDistanceToNow } from "date-fns";
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
          <ERC20Table chain={chain} tokens={tokens} isLoading={isLoading} />
        ) : activeTab === "nft" ? (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {nfts.map((nft, idx) => (
              <NFTCard key={idx} nft={nft} chain={chain} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ERC20Table({
  chain,
  tokens,
  isLoading,
}: { chain: ChainMetadata; tokens: TokenDetails[]; isLoading: boolean }) {
  const explorer = chain.explorers?.[0];
  const totalValueUsdCents =
    tokens.reduce((sum, token) => sum + (token.totalValueUsdCents ?? 0), 0) *
    0.01;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={3} />
          <TableHead>Total: ${totalValueUsdCents.toFixed(2)}</TableHead>
        </TableRow>
      </TableHeader>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Decimals</TableHead>
          <TableHead>Last Transferred</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>USD Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <Spinner />
        ) : (
          tokens.map((token) => (
            <TableRow key={token.contractAddress}>
              <TableCell>
                <div>
                  <span>
                    {token.symbol} ({token.name})
                  </span>
                  <div className="text-gray-500 text-sm">
                    {explorer && token.contractAddress !== "Native" ? (
                      <a
                        href={`${explorer.url}/address/${token.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {token.contractAddress}
                      </a>
                    ) : (
                      token.contractAddress
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{token.decimals}</TableCell>
              <TableCell>
                {token.lastTransferredDate && (
                  <span title={token.lastTransferredDate}>
                    {formatDistanceToNow(new Date(token.lastTransferredDate), {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </TableCell>
              <TableCell>{toTokens(token.balance, token.decimals)}</TableCell>
              <TableCell>
                {token.totalValueUsdCents
                  ? `$${(token.totalValueUsdCents * 0.01).toFixed(2)}`
                  : "--"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
