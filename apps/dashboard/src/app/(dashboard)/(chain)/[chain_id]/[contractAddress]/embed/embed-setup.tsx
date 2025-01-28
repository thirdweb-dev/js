"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import {
  type Account,
  useApiKeys,
  useCreateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, FormControl, Input, Select } from "@chakra-ui/react";
import { LazyCreateAPIKeyDialog } from "components/settings/ApiKeys/Create/LazyCreateAPIKeyDialog";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { AlertCircleIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { StoredChain } from "stores/chainStores";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";
import { Card, FormHelperText, FormLabel, Heading, Text } from "tw-components";

interface EmbedSetupProps {
  contract: ThirdwebContract;
  ercOrMarketplace: string;
  twAccount: Account | undefined;
}

// MAKE SURE THIS IS v1 embed hashes!!
const IPFS_URI = "bafybeigdie2yyiazou7grjowoevmuip6akk33nqb55vrpezqdwfssrxyfy";
const ERC721_IPFS_URI =
  "bafybeicd3qfzelz4su7ng6n523virdsgobrc5pcbarhwqv3dj3drh645pi";

interface IframeSrcOptions {
  clientId: string;
  chain: string;
  tokenId?: string;
  listingId?: string;
  listingType?: string;
  directListingId?: string;
  englishAuctionId?: string;
  relayUrl?: string;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  biconomyApiKey?: string;
  biconomyApiId?: string;
}

const colorOptions = [
  "purple",
  "blue",
  "orange",
  "pink",
  "green",
  "red",
  "teal",
  "cyan",
  "yellow",
];

const isValidUrl = (url: string | undefined) => {
  if (!url) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const buildIframeSrc = (
  contract: ThirdwebContract,
  ercOrMarketplace?: string,
  options?: IframeSrcOptions,
): string => {
  const contractPath =
    ercOrMarketplace === "erc721" ? "" : `${ercOrMarketplace}.html`;
  const contractEmbedHash =
    ercOrMarketplace === "erc721" ? ERC721_IPFS_URI : IPFS_URI;

  if (!contract || !options || !contractEmbedHash) {
    return "";
  }

  const {
    clientId,
    chain,
    tokenId,
    listingId,
    listingType,
    directListingId,
    englishAuctionId,
    relayUrl,
    theme,
    primaryColor,
    secondaryColor,
    biconomyApiKey,
    biconomyApiId,
  } = options;

  const url = new URL(
    `https://embed.ipfscdn.io/ipfs/${contractEmbedHash}/${contractPath}`,
  );

  url.searchParams.append("contract", contract.address);
  url.searchParams.append("chain", chain);
  url.searchParams.append("clientId", clientId);

  if (tokenId !== undefined && ercOrMarketplace === "erc1155") {
    url.searchParams.append("tokenId", tokenId.toString());
  }
  if (listingId !== undefined && ercOrMarketplace === "marketplace") {
    url.searchParams.append("listingId", listingId.toString());
  }
  if (
    directListingId !== undefined &&
    ercOrMarketplace === "marketplace-v3" &&
    listingType === "direct-listing"
  ) {
    url.searchParams.append("directListingId", directListingId.toString());
  }
  if (
    englishAuctionId !== undefined &&
    ercOrMarketplace === "marketplace-v3" &&
    listingType === "english-auction"
  ) {
    url.searchParams.append("englishAuctionId", englishAuctionId.toString());
  }
  if (isValidUrl(relayUrl)) {
    url.searchParams.append("relayUrl", relayUrl || "");
  }
  if (biconomyApiKey) {
    url.searchParams.append("biconomyApiKey", biconomyApiKey);
  }
  if (biconomyApiId) {
    url.searchParams.append("biconomyApiId", biconomyApiId);
  }
  if (theme) {
    url.searchParams.append("theme", theme);
  }
  if (primaryColor && primaryColor !== "default") {
    url.searchParams.append("primaryColor", primaryColor);
  }
  if (secondaryColor && secondaryColor !== "orange") {
    url.searchParams.append("secondaryColor", secondaryColor);
  }
  return url.toString();
};

// taken from @thirdweb-dev /chains
// @internal
function minimizeChain(
  chain: ChainMetadata,
): Pick<
  ChainMetadata,
  | "name"
  | "chain"
  | "rpc"
  | "nativeCurrency"
  | "shortName"
  | "chainId"
  | "testnet"
  | "slug"
  | "icon"
> {
  const [firstRpc] = chain.rpc;
  return {
    name: chain.name,
    chain: chain.chain,
    rpc: [firstRpc || ""],
    nativeCurrency: chain.nativeCurrency,
    shortName: chain.shortName,
    chainId: chain.chainId,
    testnet: chain.testnet,
    slug: chain.slug,
    icon: chain.icon,
  };
}

// taken from @thirdweb-dev /chains
// @internal
type ChainConfiguration = {
  rpc?: string | string[];
};

function configureChain(
  chain: ChainMetadata,
  chainConfig: ChainConfiguration,
): ChainMetadata {
  let additionalRPCs: string[] = [];
  if (chainConfig?.rpc) {
    if (typeof chainConfig.rpc === "string") {
      additionalRPCs = [chainConfig.rpc];
    } else {
      additionalRPCs = chainConfig.rpc;
    }
  }
  // prepend additional RPCs to the chain's RPCs
  return { ...chain, rpc: [...additionalRPCs, ...chain.rpc] };
}

export const EmbedSetup: React.FC<EmbedSetupProps> = ({
  contract,
  ercOrMarketplace,
  twAccount,
}) => {
  const trackEvent = useTrack();
  const { theme } = useTheme();

  const apiKeys = useApiKeys({
    isLoggedIn: !!twAccount,
  });
  const createKeyMutation = useCreateApiKey();

  const validApiKey = (apiKeys.data || []).find(
    (apiKey) =>
      (apiKey.domains.includes("*") ||
        apiKey.domains.includes("embed.ipfscdn.io") ||
        apiKey.domains.includes("*.ipfscdn.io")) &&
      (apiKey.services || [])
        .find((service) => service.name === "storage")
        ?.actions.includes("read") &&
      !!(apiKey.services || []).find((service) => service.name === "rpc"),
  );

  const chainId = contract.chain.id;
  const { idToChain } = useAllChainsData();

  const chain: StoredChain = (chainId ? idToChain.get(chainId) : undefined) || {
    name: "Unknown Chain",
    chainId: chainId || -1,
    rpc: [],
    chain: "unknown",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    shortName: "unknown",
    slug: "unknown",
    testnet: false,
    stackType: "",
  };

  const { register, watch } = useForm<{
    rpcUrl: string;
    relayUrl: string;
    tokenId: string;
    listingId: string;
    listingType: string;
    directListingId: string;
    englishAuctionId: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    biconomyApiKey: string;
    biconomyApiId: string;
    gasless: string;
  }>({
    defaultValues: {
      rpcUrl: chain?.rpc[0],
      tokenId: "0",
      listingId: "0",
      directListingId: "0",
      englishAuctionId: "0",
      theme: theme === "light" ? "light" : "dark",
      primaryColor: "purple",
      secondaryColor: "orange",
    },
    reValidateMode: "onChange",
  });

  const configuredChainWithNewRpc = configureChain(chain, {
    rpc: watch("rpcUrl"),
  });
  const minimizedChain = minimizeChain(configuredChainWithNewRpc);

  const iframeSrc = buildIframeSrc(contract, ercOrMarketplace, {
    chain: JSON.stringify(minimizedChain),
    clientId: validApiKey?.key || "",
    ...watch(),
  });

  const embedCode = useMemo(
    () =>
      `<iframe
    src="${iframeSrc}"
    width="100%"
    height="750px"
    style="max-width:100%;"
    frameborder="0"
></iframe>`,
    [iframeSrc],
  );

  const [showCreateAPIKeyModal, setShowCreateAPIKeyModal] = useState(false);
  const activeAccount = useActiveAccount();
  const pathname = usePathname();

  return (
    <div>
      <LazyCreateAPIKeyDialog
        prefill={{
          name: "Embed API Key",
          domains: "embed.ipfscdn.io",
        }}
        open={showCreateAPIKeyModal}
        onOpenChange={setShowCreateAPIKeyModal}
        onCreateAndComplete={() => {
          trackEvent({
            category: "api-keys",
            action: "create",
            label: "success",
            fromEmbed: true,
          });
          apiKeys.refetch();
        }}
        enableNebulaServiceByDefault={false}
        teamSlug={undefined}
      />

      <Alert variant="warning">
        <AlertCircleIcon className="size-5" />
        <AlertTitle>Deprecated</AlertTitle>
        <AlertDescription className="leading-relaxed">
          <span>
            thirdweb NFT Embeds are deprecated and not actively maintained
          </span>{" "}
          <br />
          <span>
            Use the{" "}
            <Link
              href="https://github.com/thirdweb-example/nft-minting-template"
              target="_blank"
              className="underline underline-offset-2 hover:text-foreground"
            >
              {" "}
              NFT Minting Template
            </Link>{" "}
            or build a custom NFT minting app using{" "}
            <Link
              href="https://portal.thirdweb.com/react/v5"
              className="underline underline-offset-2 hover:text-foreground"
            >
              thirdweb React SDK components
            </Link>{" "}
            instead
          </span>
        </AlertDescription>
      </Alert>

      <div className="h-8" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold text-xl tracking-tight">
            Configuration
          </h2>

          <Card className="flex w-full flex-col gap-5 bg-card">
            {ercOrMarketplace === "marketplace" ? (
              <FormControl>
                <FormLabel>Listing ID</FormLabel>
                <Input type="number" {...register("listingId")} />
                <FormHelperText>
                  The listing ID the embed should display
                </FormHelperText>
              </FormControl>
            ) : null}

            {ercOrMarketplace === "marketplace-v3" ? (
              <FormControl>
                <FormLabel>Listing type</FormLabel>
                <Select {...register("listingType")}>
                  <option value="direct-listing">Direct Listing</option>
                  <option value="english-auction">English Auction</option>
                </Select>
                <FormHelperText>
                  The type of listing the embed should display
                </FormHelperText>
              </FormControl>
            ) : null}

            {ercOrMarketplace === "marketplace-v3" &&
            watch("listingType") === "direct-listing" ? (
              <FormControl>
                <FormLabel>Direct Listing ID</FormLabel>
                <Input type="number" {...register("directListingId")} />
                <FormHelperText>
                  The direct listing ID the embed should display
                </FormHelperText>
              </FormControl>
            ) : null}

            {ercOrMarketplace === "marketplace-v3" &&
            watch("listingType") === "english-auction" ? (
              <FormControl>
                <FormLabel>English Auction ID</FormLabel>
                <Input type="number" {...register("englishAuctionId")} />
                <FormHelperText>
                  The english auction ID the embed should display
                </FormHelperText>
              </FormControl>
            ) : null}

            {ercOrMarketplace === "erc1155" ? (
              <FormControl>
                <FormLabel>Token ID</FormLabel>
                <Input type="number" {...register("tokenId")} />
                <FormHelperText>
                  The token ID the embed should display
                </FormHelperText>
              </FormControl>
            ) : null}

            <FormControl>
              <FormLabel>Client ID</FormLabel>
              {!activeAccount ? (
                <Button asChild className="w-full">
                  <Link
                    href={`/login${
                      pathname ? `?next=${encodeURIComponent(pathname)}` : ""
                    }`}
                  >
                    Sign in to create a client ID
                  </Link>
                </Button>
              ) : validApiKey ? (
                <Input
                  readOnly
                  disabled
                  value={`${validApiKey?.name} - ${validApiKey?.key}`}
                />
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    trackEvent({
                      category: "api-keys",
                      action: "create",
                      label: "attempt",
                      fromEmbed: true,
                    });

                    setShowCreateAPIKeyModal(true);
                  }}
                  disabled={createKeyMutation.isPending}
                >
                  Create Client ID
                </Button>
              )}

              <FormHelperText>
                You need a client ID to use embeds.{" "}
                <Link
                  href="https://portal.thirdweb.com/account/api-keys"
                  className="text-link-foreground hover:text-foreground"
                  target="_blank"
                >
                  Learn more
                </Link>
                .
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>RPC Url</FormLabel>
              <Input type="url" {...register("rpcUrl")} />
              <FormHelperText>
                RPC the embed should use to connect to the blockchain.
              </FormHelperText>
            </FormControl>

            {ercOrMarketplace === "marketplace" ||
            ercOrMarketplace === "marketplace-v3" ? null : (
              <FormControl gap={4}>
                <Heading size="title.sm" mb={2}>
                  Gasless
                </Heading>
                <Select {...register("gasless")} mb={4}>
                  <option value="false">Disabled</option>
                  <option value="openZeppelin">OpenZeppelin Relayer</option>
                  <option value="biconomy">Biconomy Relayer</option>
                </Select>
                {watch("gasless") === "openZeppelin" && (
                  <FormControl>
                    <FormLabel>OpenZeppelin Relayer URL</FormLabel>
                    <Input type="url" {...register("relayUrl")} />
                  </FormControl>
                )}
                {watch("gasless") === "biconomy" && (
                  <Flex gap={4} flexDir="column">
                    <FormControl>
                      <FormLabel>Biconomy API key</FormLabel>
                      <Input type="url" {...register("biconomyApiKey")} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Biconomy API ID</FormLabel>
                      <Input type="url" {...register("biconomyApiId")} />
                    </FormControl>
                  </Flex>
                )}
                <FormHelperText>
                  A relayer can be used to make the transaction gasless for the
                  end user.{" "}
                  <Link
                    target="_blank"
                    className="text-link-foreground hover:text-foreground"
                    href="https://blog.thirdweb.com/guides/setup-gasless-transactions"
                  >
                    Learn more
                  </Link>
                </FormHelperText>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Theme</FormLabel>
              <Select {...register("theme")}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">User system</option>
              </Select>
              <FormHelperText>
                Selecting system will make it so the embed would change
                depending on the user system&apos;s preferences.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Primary Color</FormLabel>
              <Select {...register("primaryColor")}>
                {ercOrMarketplace === "erc721" && (
                  <option value="default">Default</option>
                )}
                {colorOptions.map((color) => (
                  <option key={color} value={color}>
                    {color[0]?.toUpperCase() + color.substring(1)}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                Used for the main actions button backgrounds.
              </FormHelperText>
            </FormControl>

            {ercOrMarketplace === "marketplace" ||
            ercOrMarketplace === "marketplace-v3" ? (
              <FormControl>
                <FormLabel>Secondary Color</FormLabel>
                <Select {...register("secondaryColor")}>
                  {colorOptions.map((color) => (
                    <option key={color} value={color}>
                      {color[0]?.toUpperCase() + color.substring(1)}
                    </option>
                  ))}
                </Select>
                <FormHelperText>
                  Use for secondary actions (like when the user is connected to
                  the wrong network)
                </FormHelperText>
              </FormControl>
            ) : null}
          </Card>
        </div>

        <div>
          <h2 className="mb-3 font-semibold text-xl tracking-tight">
            Embed Code
          </h2>
          <CodeClient
            code={embedCode}
            lang="html"
            onCopy={() => {
              trackEvent({
                category: "embed",
                action: "click",
                label: "copy-code",
                address: contract.address,
                chainId,
              });
            }}
          />
        </div>
      </div>

      <div className="h-8" />

      <h2 className="mb-3 font-semibold text-xl tracking-tight">Preview</h2>

      <div className="overflow-hidden rounded-lg border border-border">
        {!validApiKey ? (
          <Text>You need to create a client ID to use embeds</Text>
        ) : iframeSrc ? (
          <iframe
            title="thirdweb embed"
            src={iframeSrc}
            width="100%"
            height="750px"
            frameBorder="0"
          />
        ) : null}
      </div>
    </div>
  );
};
