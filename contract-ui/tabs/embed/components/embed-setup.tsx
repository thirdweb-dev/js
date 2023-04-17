import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useBreakpointValue } from "@chakra-ui/media-query";
import {
  Flex,
  FormControl,
  Input,
  Link,
  Select,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { Chain, configureChain, minimizeChain } from "@thirdweb-dev/chains";
import { DropContract } from "@thirdweb-dev/react";
import {
  DASHBOARD_THIRDWEB_API_KEY,
  EMBED_THIRDWEB_API_KEY,
} from "constants/rpc";
import { useTrack } from "hooks/analytics/useTrack";
import { useSupportedChainsRecord } from "hooks/chains/configureChains";
import { replaceIpfsUrl } from "lib/sdk";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiCopy } from "react-icons/fi";
import {
  Button,
  Card,
  CodeBlock,
  FormHelperText,
  FormLabel,
  Heading,
} from "tw-components";

interface EmbedSetupProps {
  contract: DropContract;
  ercOrMarketplace: string;
}

const IPFS_URI = "ipfs://QmNPU5CuaZWAaQ4vLiyhyWD86S6C2Jugwzjta5MBogomuJ";

interface IframeSrcOptions {
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
  contract?: DropContract,
  ercOrMarketplace?: string,
  options?: IframeSrcOptions,
): string => {
  const contractEmbedHash = `${IPFS_URI}/${ercOrMarketplace}.html`;

  if (!contract || !options || !contractEmbedHash) {
    return "";
  }

  const {
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

  const url = new URL(replaceIpfsUrl(contractEmbedHash));

  url.searchParams.append("contract", contract.getAddress());
  url.searchParams.append("chain", chain);

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
  if (theme && theme !== "light") {
    url.searchParams.append("theme", theme);
  }
  if (primaryColor && primaryColor !== "purple") {
    url.searchParams.append("primaryColor", primaryColor);
  }
  if (secondaryColor && secondaryColor !== "orange") {
    url.searchParams.append("secondaryColor", secondaryColor);
  }
  return url.toString();
};

export const EmbedSetup: React.FC<EmbedSetupProps> = ({
  contract,
  ercOrMarketplace,
}) => {
  const trackEvent = useTrack();

  const chainId = useDashboardEVMChainId();
  const configuredChains = useSupportedChainsRecord();

  const chain = useMemo(() => {
    if (!chainId) {
      return undefined;
    }

    const configuredChain = configuredChains[chainId];

    const rpc = configuredChain.rpc[0];

    if (rpc.includes(DASHBOARD_THIRDWEB_API_KEY)) {
      return configureChain(configuredChain, {
        rpc: rpc.replace(DASHBOARD_THIRDWEB_API_KEY, EMBED_THIRDWEB_API_KEY),
      });
    }

    // eslint-disable-next-line no-template-curly-in-string
    if (rpc.includes("${THIRDWEB_API_KEY}")) {
      return configureChain(configuredChain, {
        // eslint-disable-next-line no-template-curly-in-string
        rpc: rpc.replace("${THIRDWEB_API_KEY}", EMBED_THIRDWEB_API_KEY),
      });
    }

    return configuredChain;
  }, [chainId, configuredChains]);

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

  const configuredChainWithNewRpc = configureChain(chain as Chain, {
    rpc: watch("rpcUrl"),
  });
  const minimizedChain = minimizeChain(configuredChainWithNewRpc);

  const iframeSrc = buildIframeSrc(contract, ercOrMarketplace, {
    chain: JSON.stringify(minimizedChain),
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

  const { hasCopied, onCopy, setValue } = useClipboard(embedCode, 3000);

  useEffect(() => {
    if (embedCode) {
      setValue(embedCode);
    }
  }, [embedCode, setValue]);

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
                address: contract?.getAddress(),
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
        {iframeSrc ? (
          <iframe
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
