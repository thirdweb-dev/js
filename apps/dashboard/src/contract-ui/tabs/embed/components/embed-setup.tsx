import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useApiKeys, useCreateApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Flex,
  FormControl,
  Input,
  Link,
  Select,
  Stack,
  useBreakpointValue,
  useClipboard,
} from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiCopy } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import type { ChainMetadata } from "thirdweb/chains";
import {
  Button,
  Card,
  CodeBlock,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
} from "tw-components";
import type { StoredChain } from "../../../../contexts/configured-chains";

interface EmbedSetupProps {
  contract: ThirdwebContract;
  ercOrMarketplace: string;
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
  } catch (e) {
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
    rpc: [firstRpc],
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
}) => {
  const trackEvent = useTrack();

  const apiKeys = useApiKeys();
  const createKeyMutation = useCreateApiKey();
  const { onSuccess, onError } = useTxNotifications(
    "API key created",
    "Failed to create API key",
  );

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

  const chainId = useDashboardEVMChainId();
  const configuredChains = useSupportedChainsRecord();

  const chain = (configuredChains[chainId as number] as
    | StoredChain
    | undefined) || {
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
      theme: "light",
      primaryColor: "purple",
      secondaryColor: "orange",
    },
    reValidateMode: "onChange",
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

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
    width="600px"
    height="600px"
    style="max-width:100%;"
    frameborder="0"
></iframe>`,
    [iframeSrc],
  );

  const { hasCopied, onCopy } = useClipboard(embedCode, 3000);

  return (
    <Flex gap={8} direction="column">
      <Flex gap={8} direction={{ base: "column", md: "row" }}>
        <Stack as={Card} w={{ base: "100%", md: "50%" }}>
          <Heading size="title.sm" mb={4}>
            Configuration
          </Heading>
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
            {validApiKey ? (
              <Input
                readOnly
                disabled
                value={`${validApiKey?.name} - ${validApiKey?.key}`}
              />
            ) : (
              <Button
                bgColor="bgBlack"
                color="bgWhite"
                _hover={{
                  opacity: 0.8,
                }}
                onClick={() => {
                  trackEvent({
                    category: "api-keys",
                    action: "create",
                    label: "attempt",
                    fromEmbed: true,
                  });

                  createKeyMutation.mutate(
                    {
                      name: "Embed API key",
                      domains: ["embed.ipfscdn.io"],
                      services: [
                        {
                          name: "rpc",
                          targetAddresses: ["*"],
                        },
                        {
                          name: "storage",
                          targetAddresses: ["*"],
                          actions: ["read"],
                        },
                      ],
                    },
                    {
                      onSuccess: () => {
                        onSuccess();
                        trackEvent({
                          category: "api-keys",
                          action: "create",
                          label: "success",
                          fromEmbed: true,
                        });
                      },
                      onError: (err) => {
                        onError(err);
                        trackEvent({
                          category: "api-keys",
                          action: "create",
                          label: "error",
                          error: err,
                          fromEmbed: true,
                        });
                      },
                    },
                  );
                }}
                disabled={createKeyMutation.isLoading}
              >
                Create Client ID
              </Button>
            )}

            <FormHelperText>
              You need a client ID to use embeds.{" "}
              <Link
                href="https://portal.thirdweb.com/account/api-keys"
                color="primary.500"
                isExternal
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
              <Heading size="title.sm" my={4}>
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
                  isExternal
                  color="blue.500"
                  href="https://blog.thirdweb.com/guides/setup-gasless-transactions"
                >
                  Learn more
                </Link>
              </FormHelperText>
            </FormControl>
          )}
          <FormControl>
            <Heading size="title.sm" my={4}>
              Customization
            </Heading>
            <FormLabel>Theme</FormLabel>
            <Select {...register("theme")}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">User system</option>
            </Select>
            <FormHelperText>
              Selecting system will make it so the embed would change depending
              on the user system&apos;s preferences.
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
                  {color[0].toUpperCase() + color.substring(1)}
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
                    {color[0].toUpperCase() + color.substring(1)}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                Use for secondary actions (like when the user is connected to
                the wrong network)
              </FormHelperText>
            </FormControl>
          ) : null}
        </Stack>
        <Stack as={Card} w={{ base: "100%", md: "50%" }}>
          <Heading size="title.sm">Embed Code</Heading>
          <CodeBlock
            canCopy={false}
            whiteSpace="pre"
            overflowX="auto"
            code={embedCode}
            language="markup"
          />
          <Button
            colorScheme="purple"
            w="auto"
            variant="outline"
            onClick={() => {
              onCopy();
              trackEvent({
                category: "embed",
                action: "click",
                label: "copy-code",
                address: contract.address,
                chainId,
              });
            }}
            leftIcon={hasCopied ? <IoMdCheckmark /> : <FiCopy />}
          >
            {hasCopied ? "Copied!" : "Copy to clipboard"}
          </Button>
        </Stack>
      </Flex>

      <Stack align="center" gap={2}>
        <Heading size="title.sm">Preview</Heading>
        {!validApiKey ? (
          <Text>You need to create a client ID to use embeds</Text>
        ) : iframeSrc ? (
          <iframe
            title="thirdweb embed"
            src={iframeSrc}
            width={isMobile ? "100%" : "600px"}
            height="600px"
            frameBorder="0"
          />
        ) : null}
      </Stack>
    </Flex>
  );
};
