import { thirdwebClient } from "@/constants/client";
import {
  type EVMContractInfo,
  useEVMContractInfo,
  useSetEVMContractInfo,
} from "@3rdweb-sdk/react";
import { Box, Container, Flex } from "@chakra-ui/react";
import {
  type DehydratedState,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { AppLayout } from "components/app-layouts/app";
import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { ensQuery } from "components/contract-components/hooks";
import { ContractMetadata } from "components/custom-contract/contract-header/contract-metadata";
import { THIRDWEB_DOMAIN } from "constants/urls";
import { SupportedChainsReadyContext } from "contexts/configured-chains";
import { PrimaryDashboardButton } from "contract-ui/components/primary-dashboard-button";
import { useContractRouteConfig } from "contract-ui/hooks/useRouteConfig";
import { ContractSidebar } from "core-ui/sidebar/detail-page";
import {
  useSupportedChainsRecord,
  useSupportedChainsSlugRecord,
} from "hooks/chains/configureChains";
import { getDashboardChainRpc } from "lib/rpc";
import type { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ContractOG } from "og-lib/url-utils";
import { PageId } from "page-id";
import { useContext, useEffect, useMemo, useState } from "react";
import { getAddress, getContract, isAddress } from "thirdweb";
import { getContractMetadata } from "thirdweb/extensions/common";
import { isERC20 } from "thirdweb/extensions/erc20";
import { isERC721 } from "thirdweb/extensions/erc721";
import { isERC1155 } from "thirdweb/extensions/erc1155";
import { fetchChain } from "utils/fetchChain";
import type { ThirdwebNextPage } from "utils/types";
import { shortenIfAddress } from "utils/usedapp-external";
import { Spinner } from "../../@/components/ui/Spinner/Spinner";
import { Alert } from "../../@/components/ui/alert";
import { ClientOnly } from "../../components/ClientOnly/ClientOnly";
import { DeprecatedAlert } from "../../components/shared/DeprecatedAlert";
import { mapV4ChainToV5Chain } from "../../contexts/map-chains";
import { useV5DashboardChain } from "../../lib/v5-adapter";

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

const ContractPage: ThirdwebNextPage = () => {
  // show optimistic UI first - assume chain is configured until proven otherwise
  const [chainNotFound, setChainNotFound] = useState(false);
  const isSupportedChainsReady = useContext(SupportedChainsReadyContext);

  const contractInfo = useEVMContractInfo();

  const chain = contractInfo?.chain ?? undefined;
  const chainSlug = contractInfo?.chainSlug;
  const contractAddress = contractInfo?.contractAddress || "";

  const setContractInfo = useSetEVMContractInfo();
  const supportedChainsSlugRecord = useSupportedChainsSlugRecord();
  const configuredChainsRecord = useSupportedChainsRecord();

  // this will go away as part of the RSC rewrite!
  // eslint-disable-next-line no-restricted-syntax
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
        configuredChain &&
        getDashboardChainRpc(configuredChain.chainId, configuredChain) !==
          getDashboardChainRpc(chain.chainId, chain)
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

  const isSlugNumber = !Number.isNaN(Number(chainSlug));

  const router = useRouter();

  const activeTab = router.query?.paths?.[1] || "overview";

  const v5Chain = useV5DashboardChain(chain?.chainId);
  const contract = useMemo(() => {
    if (!contractAddress || !v5Chain) {
      return undefined;
    }
    return getContract({
      address: contractAddress,
      client: thirdwebClient,
      chain: v5Chain,
    });
  }, [contractAddress, v5Chain]);

  const routes = useContractRouteConfig(contractAddress, contract);

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === activeTab),
    [activeTab, routes],
  );

  if (!contractInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (chainNotFound) {
    return (
      <div className="mx-auto max-w-[500px]">
        <Alert variant="warning">
          You tried to connecting to {isSlugNumber ? "Chain" : "Network"} ID{" "}
          {`"`}
          {chainSlug}
          {`"`} but it is not configured yet. Please configure it and try again
        </Alert>

        <div className="h-10" />

        <div className="border border-border rounded-lg">
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
        </div>
      </div>
    );
  }

  if (!isSupportedChainsReady) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner className="size-10" />
      </div>
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
              {contract && (
                <ContractMetadata contract={contract} chain={chain} />
              )}
              <PrimaryDashboardButton contractAddress={contractAddress} />
            </Flex>
            <DeprecatedAlert chain={chain} />
          </Flex>
        </Container>
      </Box>
      {contract && (
        <ContractSidebar
          contract={contract}
          routes={routes}
          activeRoute={activeRoute}
        />
      )}
      <Container pt={8} maxW="container.page">
        {activeRoute?.component && contractAddress && contract && (
          <activeRoute.component
            contractAddress={contractAddress}
            contract={contract}
          />
        )}
      </Container>
    </Flex>
  );
};

export default ContractPage;
ContractPage.pageId = PageId.DeployedContract;
ContractPage.getLayout = (page, props: EVMContractProps) => {
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
                    alt: "",
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
    <div className="h-full flex items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}

// app layout has to come first in both getLayout and fallback
ContractPage.fallback = (
  <AppLayout layout={"custom-contract"} noSEOOverride hasSidebar={true}>
    <PageSkeleton />
  </AppLayout>
);

// server side ---------------------------------------------------------------

export const getStaticProps: GetStaticProps<EVMContractProps> = async (ctx) => {
  const chainSlug = ctx.params?.chain_id as string;
  const [contractAddress] = ctx.params?.paths as string[];

  let address: string | null = null;
  const queryClient = new QueryClient();

  const lowercaseAddress = contractAddress.toLowerCase();
  const checksummedAddress = isAddress(lowercaseAddress)
    ? getAddress(lowercaseAddress)
    : lowercaseAddress;

  try {
    const queryResult = await queryClient.fetchQuery(
      ensQuery(checksummedAddress),
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

  let detectedExtension: EVMContractProps["detectedExtension"] = "unknown";
  let contractMetadata: {
    [key: string]: unknown;
    name: string;
    symbol: string;
  } | null = null;

  if (chain?.chainId) {
    try {
      const contract = getContract({
        address,
        // eslint-disable-next-line no-restricted-syntax
        chain: mapV4ChainToV5Chain(chain),
        client: thirdwebClient,
      });
      const [isErc20, isErc721, isErc1155, _contractMetadata] =
        await Promise.all([
          isERC20({ contract }).catch(() => false),
          isERC721({ contract }).catch(() => false),
          isERC1155({ contract }).catch(() => false),
          getContractMetadata({ contract }).catch(() => null),
        ]);
      contractMetadata = _contractMetadata;
      // set the detected extension
      if (isErc20) {
        detectedExtension = "erc20";
      } else if (isErc721) {
        detectedExtension = "erc721";
      } else if (isErc1155) {
        detectedExtension = "erc1155";
      }
    } catch {
      // ignore, most likely requires import
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      contractInfo: {
        chainSlug,
        contractAddress: checksummedAddress,
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
