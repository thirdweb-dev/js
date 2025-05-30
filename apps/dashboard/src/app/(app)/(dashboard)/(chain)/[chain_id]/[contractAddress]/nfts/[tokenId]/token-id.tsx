"use client";

import { UnexpectedValueErrorMessage } from "@/components/blocks/error-fallbacks/unexpect-value-error-message";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { useChainSlug } from "hooks/chains/chainSlug";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NFT, ThirdwebClient, ThirdwebContract } from "thirdweb";
import { getNFT as getErc721NFT } from "thirdweb/extensions/erc721";
import { getNFT as getErc1155NFT } from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";
import { NftProperty } from "../components/nft-property";
import { useNFTDrawerTabs } from "./useNftDrawerTabs";

function isValidUrl(possibleUrl?: string | null) {
  if (!possibleUrl) {
    return false;
  }
  try {
    new URL(possibleUrl);
  } catch (_) {
    if (possibleUrl.startsWith("ipfs://")) {
      return true;
    }
    return false;
  }

  return true;
}

interface TokenIdPageProps {
  tokenId: string;
  contract: ThirdwebContract;
  isErc721: boolean;
  isLoggedIn: boolean;
  accountAddress: string | undefined;
  projectMeta: ProjectMeta | undefined;
}

// TODO: verify the entire nft object with zod schema and display an error message

export const TokenIdPage: React.FC<TokenIdPageProps> = ({
  contract,
  tokenId,
  isErc721,
  isLoggedIn,
  accountAddress,
  projectMeta,
}) => {
  const [tab, setTab] = useState("Details");
  const chainId = contract.chain.id;
  const chainSlug = useChainSlug(chainId || 1);

  const tabs = useNFTDrawerTabs({
    contract,
    tokenId,
    isLoggedIn,
    accountAddress,
  });

  const { data: nft, isPending } = useReadContract(
    isErc721 ? getErc721NFT : getErc1155NFT,
    {
      contract,
      tokenId: BigInt(tokenId || 0),
      includeOwner: true,
      tokenByIndex: false,
    },
  );

  if (isPending) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!nft) {
    return (
      <p>
        No NFT found with token ID {tokenId}. Please check the token ID and try
        again.
      </p>
    );
  }

  // in the case we have an invalid url, we want to remove it
  const nftMetadata = {
    ...nft.metadata,
    animation_url: isValidUrl(nft.metadata.animation_url)
      ? nft.metadata.animation_url
      : undefined,
  };

  const nftsPagePath = buildContractPagePath({
    projectMeta,
    chainIdOrSlug: chainSlug.toString(),
    contractAddress: contract.address,
    subpath: "/nfts",
  });

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="relative aspect-square w-full shrink-0 self-start overflow-hidden bg-card lg:w-[350px]">
          {/* border */}
          <div className="absolute inset-0 z-0 rounded-lg border" />
          {/* media */}
          <NFTMediaWithEmptyState metadata={nftMetadata} className="z-10" />
        </div>

        <div className="flex w-full flex-col gap-6">
          {/* breadcrumb + title */}
          <div>
            <Breadcrumb className="mb-3">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={nftsPagePath}>NFTs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>#{tokenId}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-1.5">
              <NFTName value={nft.metadata.name} />
              {nft.metadata?.description && (
                <NFTDescription value={nft.metadata.description} />
              )}
            </div>
          </div>

          <TabButtons
            tabClassName="!text-sm"
            tabs={[
              {
                name: "Details",
                onClick: () => setTab("Details"),
                isActive: tab === "Details",
                isDisabled: false,
              },
              ...tabs.map((tb) => ({
                name: tb.title,
                onClick: () => setTab(tb.title),
                isActive: tab === tb.title,
                isDisabled: tb.isDisabled,
                toolTip: tb.isDisabled ? tb.disabledText : undefined,
              })),
            ].sort((a, b) => (a.isDisabled ? 1 : b.isDisabled ? -1 : 0))}
          />

          {/* tab contents */}
          {tab === "Details" && (
            <NFTDetailsTab nft={nft} client={contract.client} />
          )}

          {tabs.map((tb) => {
            return (
              tb.title === tab && (
                <div key={tb.title} className="w-full">
                  {tb.children}
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

function NFTDetailsTab(props: {
  nft: NFT;
  client: ThirdwebClient;
}) {
  const { nft, client } = props;
  const properties = nft.metadata.attributes || nft.metadata.properties;

  return (
    <div className="flex flex-col gap-8">
      {/* common */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 items-center gap-x-8 gap-y-4 lg:grid-cols-[1fr_2fr]">
          {/* token id */}
          <div>
            <p className="mb-1 text-muted-foreground text-sm">Token ID</p>
            <CopyTextButton
              textToCopy={nft.id?.toString()}
              textToShow={
                nft.id?.toString().length > 8
                  ? `${nft.id.toString().slice(0, 4)}...${nft.id.toString().slice(-4)}`
                  : nft.id?.toString()
              }
              tooltip="Token ID"
              copyIconPosition="right"
              className="min-w-16 justify-between bg-card"
            />
          </div>

          {/* owner */}
          {nft.owner && (
            <div>
              <p className="mb-1 text-muted-foreground text-sm">Owner</p>
              <WalletAddress
                client={client}
                address={nft.owner}
                className="h-auto rounded-full border bg-card px-2 py-1 pr-4 text-foreground text-sm"
              />
            </div>
          )}

          {/* type */}
          <div>
            <p className="mb-1 text-muted-foreground text-sm">Token Standard</p>
            <Badge
              variant="outline"
              className="bg-card py-1 font-normal text-sm"
            >
              {nft.type}
            </Badge>
          </div>

          {/* supply */}
          {nft.type !== "ERC721" && (
            <div className="w-full">
              <p className="mb-1 text-muted-foreground text-sm">Supply</p>
              <ToolTipLabel
                label={nft.supply.toLocaleString("en-US")}
                contentClassName="text-sm break-all"
              >
                <p className="max-w-[200px] truncate text-sm">
                  {nft.supply.toLocaleString("en-US")}
                </p>
              </ToolTipLabel>
            </div>
          )}

          {/* token uri */}
          <div>
            <p className="mb-1 text-muted-foreground text-sm">Token URI</p>
            <IPFSLinkGroup
              ipfsLink={nft.tokenURI}
              tooltip="The URI of this NFT"
              client={client}
              httpsLinkTooltip="View URI"
            />
          </div>

          {/* media uri */}
          {nft.metadata.image && (
            <div>
              <p className="mb-1 text-muted-foreground text-sm">Media URI</p>
              <IPFSLinkGroup
                ipfsLink={nft.metadata.image}
                tooltip="The media URI of this NFT"
                client={client}
                httpsLinkTooltip="View Media"
              />
            </div>
          )}
        </div>
      </div>

      {/* attributes */}
      {properties ? (
        <div>
          <h3 className="mb-2 flex items-center gap-2 font-medium text-base">
            Attributes
            {Array.isArray(properties) && properties.length > 0 && (
              <Badge
                variant="outline"
                className="bg-card px-2 text-muted-foreground"
              >
                {properties.length}
              </Badge>
            )}
          </h3>
          <div>
            {Array.isArray(properties) &&
            String(properties[0]?.value) !== "undefined" ? (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {/* biome-ignore lint/suspicious/noExplicitAny: FIXME */}
                {properties.map((property: any, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: FIXME
                  <NftProperty key={idx} property={property} />
                ))}
              </div>
            ) : (
              <CodeClient
                code={JSON.stringify(properties, null, 2) || ""}
                lang="json"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NFTName(props: {
  value: unknown;
}) {
  if (typeof props.value === "string") {
    return (
      <h2 className="font-bold text-3xl tracking-tight"> {props.value}</h2>
    );
  }

  return (
    <UnexpectedValueErrorMessage
      title="Invalid Name"
      description="Name is not a string"
      value={props.value}
      className="mb-3 rounded-lg border border-border p-4"
    />
  );
}

function IPFSLinkGroup(props: {
  ipfsLink: string;
  tooltip: string;
  client: ThirdwebClient;
  httpsLinkTooltip: string;
}) {
  const httpLink = resolveSchemeWithErrorHandler({
    client: props.client,
    uri: props.ipfsLink,
  });

  return (
    <div className="flex flex-row items-center gap-1.5">
      <CopyTextButton
        textToCopy={props.ipfsLink}
        textToShow={props.ipfsLink}
        tooltip={props.tooltip}
        copyIconPosition="right"
        className="max-w-[200px] truncate bg-card"
      />
      {httpLink && (
        <ToolTipLabel label={props.httpsLinkTooltip}>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="size-[34px] rounded-full bg-card p-0 text-muted-foreground"
          >
            <Link href={httpLink} target="_blank">
              <ExternalLinkIcon className="size-3" />
            </Link>
          </Button>
        </ToolTipLabel>
      )}
    </div>
  );
}

function NFTDescription(props: {
  value: unknown;
}) {
  if (typeof props.value === "string") {
    return <p className="text-muted-foreground text-sm"> {props.value}</p>;
  }

  return (
    <UnexpectedValueErrorMessage
      title="Invalid Description"
      description="Description is not a string"
      value={props.value}
      className="mb-3 rounded-lg border border-border p-4"
    />
  );
}
