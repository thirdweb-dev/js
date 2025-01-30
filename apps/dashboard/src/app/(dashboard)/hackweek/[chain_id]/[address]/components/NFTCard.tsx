import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Info } from "lucide-react";
import type { ChainMetadata } from "thirdweb/chains";
import type { NFTDetails } from "../hooks/useGetNFTs";

interface NFTCardProps {
  nft: NFTDetails;
  chain: ChainMetadata;
}

export function NFTCard({ nft, chain }: NFTCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Badge variant="secondary" className="absolute top-2 right-2">
            #{nft.tokenId}
          </Badge>
          {!nft.imageUrl ? (
            <div className="h-full w-full bg-gray-600" />
          ) : (
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 p-4">
        <div className="space-y-0.5">
          <h4 className="font-semibold text-sm">{nft.name ?? "(unnamed)"}</h4>
          {nft.lastAcquiredDate && (
            <p
              className="text-muted-foreground text-xs"
              title={new Date(nft.lastAcquiredDate).toLocaleString()}
            >
              Acquired{" "}
              {formatDistanceToNow(new Date(nft.lastAcquiredDate), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>
      </CardFooter>

      <div className="absolute right-2 bottom-2">
        <NFTExpandedDetails nft={nft} chain={chain} />
      </div>
    </Card>
  );
}

function NFTExpandedDetails({ nft, chain }: NFTCardProps) {
  const explorer = chain.explorers?.[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nft.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">Contract Address</h4>
            <p className="break-all font-mono text-muted-foreground text-sm">
              {nft.contractAddress}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Token ID</h4>
            <p className="text-muted-foreground text-sm">{nft.tokenId}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Contract Type</h4>
            <p className="text-muted-foreground text-sm">{nft.contractType}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Quantity</h4>
            <p className="text-muted-foreground text-sm">{nft.quantity}</p>
          </div>
          {nft.firstAcquiredDate && (
            <div>
              <h4 className="font-semibold text-sm">First Acquired</h4>
              <p className="text-muted-foreground text-sm">
                {new Date(nft.firstAcquiredDate).toLocaleString()}
              </p>
            </div>
          )}
          {nft.lastAcquiredDate && (
            <div>
              <h4 className="font-semibold text-sm">Last Acquired</h4>
              <p className="text-muted-foreground text-sm">
                {new Date(nft.lastAcquiredDate).toLocaleString()}
              </p>
            </div>
          )}
          {nft.createdAt && (
            <div>
              <h4 className="font-semibold text-sm">Created At</h4>
              <p className="text-muted-foreground text-sm">
                {new Date(nft.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          {nft.tokenCount && (
            <div>
              <h4 className="font-semibold text-sm">Total Supply</h4>
              <p className="text-muted-foreground text-sm">{nft.tokenCount}</p>
            </div>
          )}
          {nft.ownerCount && (
            <div>
              <h4 className="font-semibold text-sm">Unique Owners</h4>
              <p className="text-muted-foreground text-sm">{nft.ownerCount}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.open(
                  `https://opensea.io/assets/${nft.contractAddress}/${nft.tokenId}`,
                  "_blank",
                )
              }
            >
              View on OpenSea
            </Button>
            {explorer && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  window.open(
                    `${explorer.url}/token/${nft.contractAddress}`,
                    "_blank",
                  )
                }
              >
                View on {explorer.name}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
