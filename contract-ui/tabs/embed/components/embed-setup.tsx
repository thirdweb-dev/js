import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import { useBreakpointValue } from "@chakra-ui/media-query";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  FormControl,
  Input,
  Link,
  Select,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { ContractType, ValidContractInstance } from "@thirdweb-dev/sdk/evm";
import { useTrack } from "hooks/analytics/useTrack";
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
  contract?: ValidContractInstance | null;
  contractType?: string | null;
}

const IPFS_URI = "ipfs://QmQM4Njtt2o4cQ98Mi2kBD6rBsfH6LfeaRYBYLpR41nVFs";

interface IframeSrcOptions {
  rpcUrl: string;
  ipfsGateway: string;
  chainId?: number;
  tokenId?: string;
  listingId?: string;
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
  contract?: ValidContractInstance,
  contractType?: ContractType,
  options?: IframeSrcOptions,
): string => {
  const contractEmbedHash = `${IPFS_URI}/${contractType}.html`;

  if (!contract || !options || !contractEmbedHash || !options.chainId) {
    return "";
  }

  const {
    rpcUrl,
    ipfsGateway,
    chainId,
    tokenId,
    listingId,
    relayUrl,
    theme,
    primaryColor,
    secondaryColor,
    biconomyApiKey,
    biconomyApiId,
  } = options;

  const url = new URL(contractEmbedHash.replace("ipfs://", ipfsGateway));

  url.searchParams.append("contract", contract.getAddress());
  url.searchParams.append("chainId", chainId.toString());

  if (tokenId !== undefined && contractType === "edition-drop") {
    url.searchParams.append("tokenId", tokenId.toString());
  }
  if (listingId !== undefined && contractType === "marketplace") {
    url.searchParams.append("listingId", listingId.toString());
  }
  if (rpcUrl) {
    url.searchParams.append("rpcUrl", rpcUrl);
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
  contractType,
}) => {
  const trackEvent = useTrack();
  const { register, watch } = useForm<{
    ipfsGateway: string;
    rpcUrl: string;
    relayUrl: string;
    tokenId: string;
    listingId: string;
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    biconomyApiKey: string;
    biconomyApiId: string;
    gasless: string;
  }>({
    defaultValues: {
      ipfsGateway: "https://gateway.ipfscdn.io/ipfs/",
      tokenId: "0",
      listingId: "0",
      theme: "light",
      primaryColor: "purple",
      secondaryColor: "orange",
    },
    reValidateMode: "onChange",
  });

  const chainId = useDashboardEVMChainId();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const iframeSrc = buildIframeSrc(
    contract as unknown as ValidContractInstance,
    contractType as ContractType,
    {
      chainId,
      ...watch(),
    },
  );

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
          <FormControl>
            <FormLabel>IPFS Gateway</FormLabel>
            <Input type="url" {...register("ipfsGateway")} />
          </FormControl>
          {contractType === "marketplace" ? (
            <FormControl>
              <FormLabel>Listing ID</FormLabel>
              <Input type="number" {...register("listingId")} />
              <FormHelperText>
                The listing ID the embed should display
              </FormHelperText>
            </FormControl>
          ) : null}
          {contractType === "edition-drop" ? (
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
              Provide your own RPC url to use for this embed.
            </FormHelperText>
          </FormControl>

          {contractType === "marketplace" ? null : (
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
              on the user system&apos;s preferences
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
          {contractType === "marketplace" ? (
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
        ) : (
          <>
            {!watch("ipfsGateway") && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>Missing IPFS Gateway</AlertTitle>
              </Alert>
            )}
          </>
        )}
      </Stack>
    </Flex>
  );
};
