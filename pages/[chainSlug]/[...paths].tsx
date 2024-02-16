import {
  EVMContractInfo,
  useEVMContractInfo,
  useSetEVMContractInfo,
} from "@3rdweb-sdk/react";
import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { useContract, useContractMetadata } from "@thirdweb-dev/react";
import { detectContractFeature } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { ensQuery } from "components/contract-components/hooks";
import { ContractMetadata } from "components/custom-contract/contract-header/contract-metadata";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { SupportedChainsReadyContext } from "contexts/configured-chains";
import { PrimaryDashboardButton } from "contract-ui/components/primary-dashboard-button";
import { useContractRouteConfig } from "contract-ui/hooks/useRouteConfig";
import { ContractProgramSidebar } from "core-ui/sidebar/detail-page";
import {
  useSupportedChainsRecord,
  useSupportedChainsSlugRecord,
} from "hooks/chains/configureChains";
import { getDashboardChainRpc } from "lib/rpc";
import { getEVMThirdwebSDK } from "lib/sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ContractOG } from "og-lib/url-utils";
import { PageId } from "page-id";
import { useContext, useEffect, useMemo, useState } from "react";
import { fetchChain } from "utils/fetchChain";
import { ThirdwebNextPage } from "utils/types";
import { shortenIfAddress } from "utils/usedapp-external";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { THIRDWEB_DOMAIN } from "constants/urls";
import { getAddress } from "ethers/lib/utils";
import { DeprecatedAlert } from "components/shared/DeprecatedAlert";

type EVMContractProps = {
  contractInfo?: EVMContractInfo;
  dehydratedState: DehydratedState;
  contractMetadata?: {
    name: string;
    image?: string | null;
    description?: string | null;
    symbol?: string | null;
  } | null;
  detectedExtension: "erc20" | "erc721" | "erc1155" | "unknown";
};

const EVMContractPage: ThirdwebNextPage = () => {
  // show optimistic UI first - assume chain is configured until proven otherwise
  const [chainNotFound, setChainNotFound] = useState(false);
  const isSupportedChainsReady = useContext(SupportedChainsReadyContext);

  const contractInfo = useEVMContractInfo();

  const chain = contractInfo?.chain || null;
  const chainSlug = contractInfo?.chainSlug;
  const contractAddress = contractInfo?.contractAddress || "";

  const setContractInfo = useSetEVMContractInfo();
  const supportedChainsSlugRecord = useSupportedChainsSlugRecord();
  const configuredChainsRecord = useSupportedChainsRecord();

  useEffect(() => {
    if (!isSupportedChainsReady || !chainSlug) {
      return;
    }

    // if server resolved the chain, or we resolved it on client
    if (chain) {
      setChainNotFound(false);

      // if server resolved it and user has it configured. user may have updated it on client
      // currently user can only update RPC - so check if it is updated or not
      // if updated, update the contractInfo.chain

      const configuredChain = supportedChainsSlugRecord[chainSlug];
      if (
        getDashboardChainRpc(configuredChain) !== getDashboardChainRpc(chain)
      ) {
        setContractInfo({
          chainSlug,
          contractAddress,
          chain: configuredChain,
        });
      }

      // TODO: replace the above with this logic:

      // if this chain is one of modified chains
      // override it with chain object on client to ensure it has the user overrides
    }

    // if server could not resolve the chain using allChains
    else {
      // if it is configured on client storage, use that
      if (chainSlug in supportedChainsSlugRecord) {
        setContractInfo({
          chainSlug,
          contractAddress,
          chain: supportedChainsSlugRecord[chainSlug],
        });
      } else if (chainSlug in configuredChainsRecord) {
        // this is for thirdweb internal tools
        // it allows us to use chainId as slug for a custom network as well

        const chainId = Number(chainSlug);
        const _chain = configuredChainsRecord[chainId];

        // replace the chainId with slug in URL without reloading the page
        // If we don't do this, tanstack router creates issues
        window.history.replaceState(
          null,
          document.title,
          `/${_chain.slug}/${contractAddress}`,
        );

        setContractInfo({
          chainSlug: _chain.slug,
          contractAddress,
          chain: _chain,
        });
      }

      // if not found in storage as well
      else {
        // user needs to configure it manually
        setChainNotFound(true);
      }
    }
  }, [
    chain,
    chainSlug,
    supportedChainsSlugRecord,
    configuredChainsRecord,
    contractAddress,
    setContractInfo,
    isSupportedChainsReady,
  ]);

  const isSlugNumber = !isNaN(Number(chainSlug));

  const router = useRouter();

  const activeTab = router.query?.paths?.[1] || "overview";
  const contractQuery = useContract(contractAddress);
  const contractMetadataQuery = useContractMetadata(contractQuery.contract);
  const routes = useContractRouteConfig(contractAddress);

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === activeTab),
    [activeTab, routes],
  );

  if (chainNotFound) {
    return (
      <HomepageSection maxW="container.md" mx="auto">
        <Box mb={8} mt={8}>
          <Alert borderRadius="md" background="backgroundHighlight">
            <AlertIcon />
            You tried to connecting to {isSlugNumber
              ? "Chain"
              : "Network"} ID {`"`}
            {chainSlug}
            {`"`} but it is not configured yet. Please configure it and try
            again.
          </Alert>
        </Box>

        <Box
          border="1px solid"
          borderRadius="md"
          borderColor="backgroundHighlight"
          overflow="hidden"
          _light={{
            background: "white",
          }}
        >
          <ConfigureNetworks
            prefillSlug={isSlugNumber ? undefined : chainSlug}
            prefillChainId={isSlugNumber ? chainSlug : undefined}
            onNetworkConfigured={(network) => {
              if (
                chainSlug === network.slug ||
                chainSlug === `${network.chainId}`
              ) {
                setChainNotFound(false);
              }
            }}
          />
        </Box>
      </HomepageSection>
    );
  }

  if (!isSupportedChainsReady) {
    return (
      <Flex h="100%" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      w="100%"
      key={`${chainSlug}/${contractAddress}/contract`}
    >
      <Box borderColor="borderColor" borderBottomWidth={1} w="full" pb={8}>
        <Container maxW="container.page">
          <Flex direction="column" gap={4}>
            <Flex
              justify="space-between"
              align={{ base: "inherit", md: "center" }}
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <ContractMetadata
                contractAddress={contractAddress}
                metadataQuery={contractMetadataQuery}
                chain={chain}
              />
              <PrimaryDashboardButton contractAddress={contractAddress} />
            </Flex>
            {chain?.name && (
              <DeprecatedAlert
                chainName={chain.name}
                description="You can't interact with this contract through the dashboard as this chain has been deprecated."
              />
            )}
          </Flex>
        </Container>
      </Box>
      <ContractProgramSidebar
        address={contractAddress}
        metadataQuery={contractMetadataQuery}
        routes={routes}
        activeRoute={activeRoute}
      />
      <Container pt={8} maxW="container.page">
        {activeRoute?.component && (
          <activeRoute.component contractAddress={contractAddress} />
        )}
      </Container>
    </Flex>
  );
};

export default EVMContractPage;
EVMContractPage.pageId = PageId.DeployedContract;
EVMContractPage.getLayout = (page, props: EVMContractProps) => {
  const displayName = `${
    props.contractMetadata?.name ||
    shortenIfAddress(props.contractInfo?.contractAddress) ||
    "Contract"
  }${
    props.contractMetadata?.symbol ? ` (${props.contractMetadata.symbol})` : ""
  }`;

  const ogImage = ContractOG.toUrl({
    displayName: props.contractMetadata?.name || "",
    contractAddress: props.contractInfo?.contractAddress || "",
    logo: props.contractMetadata?.image || "",
    chainName: props.contractInfo?.chain?.name || "",
  });

  const cleanedChainName = props.contractInfo?.chain?.name
    .replace("Mainnet", "")
    .replace("Testnet", "")
    .trim();
  const url = `${THIRDWEB_DOMAIN}/${props.contractInfo?.chainSlug}/${props.contractInfo?.contractAddress}/`;
  const SEOTitle = `${displayName} | ${
    cleanedChainName ? `${cleanedChainName} ` : ""
  }Smart Contract`;

  let SEOdescription = "";

  // determine the SEO description
  if (
    props.detectedExtension === "erc721" ||
    props.detectedExtension === "erc1155"
  ) {
    SEOdescription = `View tokens, source code, transactions, balances, and analytics for the ${displayName} smart contract${
      cleanedChainName ? ` on ${cleanedChainName}` : ""
    }.`;
  } else if (props.detectedExtension === "erc20") {
    SEOdescription = `View ERC20 tokens, transactions, balances, source code, and analytics for the ${displayName} smart contract${
      cleanedChainName ? ` on ${cleanedChainName}` : ""
    }.`;
  } else {
    SEOdescription = `View tokens, transactions, balances, source code, and analytics for the ${displayName} smart contract${
      cleanedChainName ? ` on ${cleanedChainName}` : ""
    }.`;
  }

  return (
    // app layout has to come first in both getLayout and fallback
    <AppLayout
      layout={"custom-contract"}
      dehydratedState={props.dehydratedState}
      // has to be passed directly because the provider can not be above app layout in the tree
      contractInfo={props.contractInfo}
      noSEOOverride
      hasSidebar={true}
    >
      <>
        <NextSeo
          title={SEOTitle}
          description={SEOdescription}
          openGraph={{
            title: SEOTitle,
            description: SEOdescription,
            images: ogImage
              ? [
                  {
                    url: ogImage.toString(),
                    alt: ``,
                    width: 1200,
                    height: 630,
                  },
                ]
              : undefined,
            url,
          }}
        />
        <ClientOnly ssr={<PageSkeleton />}>{page}</ClientOnly>
      </>
    </AppLayout>
  );
};

function PageSkeleton() {
  return (
    <Flex h="100%" justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  );
}

// app layout has to come first in both getLayout and fallback
EVMContractPage.fallback = (
  <AppLayout layout={"custom-contract"} noSEOOverride hasSidebar={true}>
    <PageSkeleton />
  </AppLayout>
);

// server side ---------------------------------------------------------------

export const getStaticProps: GetStaticProps<EVMContractProps> = async (ctx) => {
  const chainSlug = ctx.params?.chainSlug as string;
  const [contractAddress] = ctx.params?.paths as string[];

  let address: string | null = null;
  const queryClient = new QueryClient();

  const lowercaseAddress = contractAddress.toLowerCase();
  const checksummedAdress = lowercaseAddress.endsWith("eth")
    ? lowercaseAddress
    : getAddress(lowercaseAddress);

  try {
    const queryResult = await queryClient.fetchQuery(
      ensQuery(checksummedAdress),
    );
    address = queryResult?.address;
  } catch {
    return {
      notFound: true,
    };
  }

  // if we cannot get a contract address this becomes a 404
  if (!address) {
    return {
      notFound: true,
    };
  }
  const chain = await fetchChain(chainSlug);

  let contractMetadata;

  let detectedExtension: EVMContractProps["detectedExtension"] = "unknown";

  if (chain) {
    try {
      // create the SDK on the chain
      const sdk = getEVMThirdwebSDK(chain.chainId, getDashboardChainRpc(chain));
      // get the contract
      const contract = await sdk.getContract(address);
      // extract the abi to detect extensions
      // we know it's there...
      const contractWrapper = (contract as any).contractWrapper;
      // detect extension bases
      const isErc20 = detectContractFeature(contractWrapper, "ERC20");
      const isErc721 = detectContractFeature(contractWrapper, "ERC721");
      const isErc1155 = detectContractFeature(contractWrapper, "ERC1155");
      // set the detected extension
      if (isErc20) {
        detectedExtension = "erc20";
      } else if (isErc721) {
        detectedExtension = "erc721";
      } else if (isErc1155) {
        detectedExtension = "erc1155";
      }

      // get the contract metadata
      try {
        contractMetadata = await contract.metadata.get();
      } catch (err) {
        // ignore, most likely requires import
      }
    } catch (e) {
      // ignore, most likely requires import
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      contractInfo: {
        chainSlug,
        contractAddress: checksummedAdress,
        chain,
      },
      detectedExtension,
      contractMetadata: contractMetadata
        ? JSON.parse(JSON.stringify(contractMetadata))
        : null,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  };
};
