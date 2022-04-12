import { useBreakpointValue } from "@chakra-ui/media-query";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Code,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import {
  EditionDrop,
  Marketplace,
  NFTDrop,
  ValidContractInstance,
} from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { Card } from "components/layout/Card";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { getChainIdFromNetwork } from "utils/network";

interface WidgetSetupProps {
  contract?: ValidContractInstance;
}

const IPFS_URI = "ipfs://QmQpHkDDWGJPBHFKkpX1DsfzvwZXQYNVoaW4R1Lhenp6T5";

const getContractWidgetHash = (contract?: ValidContractInstance) => {
  if (contract instanceof NFTDrop) {
    // drop contract widget hash
    return `${IPFS_URI}/drop.html`;
  }
  if (contract instanceof EditionDrop) {
    // bundle drop contract widget hash
    return `${IPFS_URI}/bundledrop.html`;
  }
  if (contract instanceof Marketplace) {
    // marketplace contract widget hash
    return `${IPFS_URI}/marketplace.html`;
  }

  return null;
};

interface IframeSrcOptions {
  rpcUrl: string;
  ipfsGateway: string;
  chainId?: number;
  tokenId?: number;
  listingId?: number;
  relayUrl?: string;
}

const buildIframeSrc = (
  contract?: ValidContractInstance,
  options?: IframeSrcOptions,
): string => {
  const contractWidgetHash = getContractWidgetHash(contract);
  if (!contract || !options || !contractWidgetHash || !options.chainId) {
    return "";
  }

  const { rpcUrl, ipfsGateway, chainId, tokenId, listingId, relayUrl } =
    options;

  const url = new URL(contractWidgetHash.replace("ipfs://", ipfsGateway));

  url.searchParams.append("contract", contract.getAddress());
  url.searchParams.append("chainId", chainId.toString());

  if (tokenId !== undefined && contract instanceof EditionDrop) {
    url.searchParams.append("tokenId", tokenId.toString());
  }
  if (listingId !== undefined && contract instanceof Marketplace) {
    url.searchParams.append("listingId", listingId.toString());
  }
  if (rpcUrl) {
    url.searchParams.append("rpcUrl", rpcUrl);
  }
  if (relayUrl) {
    url.searchParams.append("relayUrl", relayUrl);
  }

  return url.toString();
};

export const WidgetSetup: React.FC<WidgetSetupProps> = ({ contract }) => {
  const [ipfsGateway, setIpfsGateway] = useState(
    "https://gateway.ipfscdn.io/ipfs/",
  );
  const [rpcUrl, setRpcUrl] = useState("");
  const [relayUrl, setRelayUrl] = useState("");
  const [tokenId, setTokenId] = useState(0);
  const [listingId, setListingId] = useState(0);

  const chainId = getChainIdFromNetwork(useSingleQueryParam("network"));
  const isMobile = useBreakpointValue({ base: true, md: false });

  const iframeSrc = buildIframeSrc(contract, {
    chainId,
    ipfsGateway,
    rpcUrl,
    tokenId,
    listingId,
    relayUrl,
  });

  const embedCode = `<iframe
    src="${iframeSrc}"
    width="600px"
    height="600px"
    style="max-width:100%;"
    frameborder="0"
  ></iframe>`;

  const { hasCopied, onCopy } = useClipboard(embedCode, 3000);

  return (
    <Flex gap={8} direction="column">
      <Flex gap={8} direction={{ base: "column", md: "row" }}>
        <Stack as={Card} w={{ base: "100%", md: "50%" }}>
          <Heading size="title.sm">Configuration</Heading>
          <FormControl>
            <FormLabel>IPFS Gateway</FormLabel>
            <Input
              type="url"
              value={ipfsGateway}
              onChange={(e) => setIpfsGateway(e.target.value)}
            />
            <FormHelperText>
              We <strong>recommend</strong> using a dedicated IPFS gateway for
              production use!
            </FormHelperText>
          </FormControl>
          {contract instanceof Marketplace ? (
            <FormControl>
              <FormLabel>Listing ID</FormLabel>
              <Input
                type="number"
                value={listingId}
                onChange={(e) => setListingId(parseInt(e.target.value))}
              />
              <FormHelperText>
                The listing ID the embed should display
              </FormHelperText>
            </FormControl>
          ) : null}
          {contract instanceof EditionDrop ? (
            <FormControl>
              <FormLabel>Token ID</FormLabel>
              <Input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(parseInt(e.target.value))}
              />
              <FormHelperText>
                The token ID the embed should display
              </FormHelperText>
            </FormControl>
          ) : null}
          <FormControl>
            <FormLabel>RPC Url</FormLabel>
            <Input
              type="url"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
            />
            <FormHelperText>
              Provide your own RPC url to use for this embed.
              <strong>(Recommended for production use!)</strong>
            </FormHelperText>
          </FormControl>

          {contract instanceof Marketplace ? null : (
            <FormControl>
              <FormLabel>Relayer Url</FormLabel>
              <Input
                type="url"
                value={relayUrl}
                onChange={(e) => setRelayUrl(e.target.value)}
              />
              <FormHelperText>
                Provide a relayer url to use for this embed. A relayer can be
                used to make the transaction gas-less for the end user.{" "}
                <Link
                  isExternal
                  color="blue.500"
                  href="https://portal.thirdweb.com/guides/setup-gasless-transactions"
                >
                  Learn more
                </Link>
              </FormHelperText>
            </FormControl>
          )}
        </Stack>
        <Stack as={Card} w={{ base: "100%", md: "50%" }}>
          <Heading size="title.sm">Embed Code</Heading>
          <Code overflowX="auto" whiteSpace="pre" fontFamily="mono" p={2}>
            {embedCode}
          </Code>
          <Button
            colorScheme="purple"
            w="auto"
            variant="outline"
            onClick={onCopy}
            rightIcon={<FiCopy />}
          >
            {hasCopied ? "Copied!" : "Copy to clipboard"}
          </Button>
        </Stack>
      </Flex>

      <Stack align="center">
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
            {!ipfsGateway && (
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
