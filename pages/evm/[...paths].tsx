import {
  EVMContractInfo,
  useEVMContractInfo,
  useSetEVMContractInfo,
} from "@3rdweb-sdk/react";
import { Alert, AlertIcon, Box, Flex, Spinner } from "@chakra-ui/react";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { useContract } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { ensQuery } from "components/contract-components/hooks";
import { ImportContract } from "components/contract-components/import-contract";
import { ContractHeader } from "components/custom-contract/contract-header";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { ContractTabRouter } from "contract-ui/layout/tab-router";
import {
  useConfiguredChainSlugRecord,
  useConfiguredChainsRecord,
  useUpdateConfiguredChains,
} from "hooks/chains/configureChains";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { getDashboardChainRpc } from "lib/rpc";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { useEffect, useMemo, useState } from "react";
import { getAllChainRecords } from "utils/allChainsRecords";
import { ThirdwebNextPage } from "utils/types";

type EVMContractProps = {
  contractInfo: EVMContractInfo;
  dehydratedState: DehydratedState;
};

const EVMContractPage: ThirdwebNextPage = () => {
  // show optimistic UI first - assume chain is conifgured until proven otherwise
  const [chainNotFound, setChainNotFound] = useState(false);

  // contractInfo is never undefined on this page
  const { chain, chainSlug, contractAddress } =
    useEVMContractInfo() as EVMContractInfo;

  const setContractInfo = useSetEVMContractInfo();
  const configuredChainSlugRecord = useConfiguredChainSlugRecord();
  const configuredChainsRecord = useConfiguredChainsRecord();
  const updateConfiguredChains = useUpdateConfiguredChains();

  useEffect(() => {
    // if server resolved the chain
    if (chain) {
      // but it is not configured
      if (!(chainSlug in configuredChainSlugRecord)) {
        // auto configure it
        updateConfiguredChains.add([
          {
            ...chain,
            isAutoConfigured: true,
          },
        ]);
      }

      // it is configured
      else {
        // if server resolved it and user has it configured. user may have updated it on client
        // currently user can only update RPC - so check if it is updated or not
        // if updated, update the contractInfo.chain

        const configuredChain = configuredChainSlugRecord[chainSlug];
        if (
          getDashboardChainRpc(configuredChain) !== getDashboardChainRpc(chain)
        ) {
          setContractInfo({
            chainSlug,
            contractAddress,
            chain: configuredChain,
          });
        }
      }
    }

    // if server could not resolve the chain using allChains
    else {
      // if it is configured on client storage, use that
      if (chainSlug in configuredChainSlugRecord) {
        setContractInfo({
          chainSlug,
          contractAddress,
          chain: configuredChainSlugRecord[chainSlug],
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
    configuredChainSlugRecord,
    configuredChainsRecord,
    contractAddress,
    setContractInfo,
    updateConfiguredChains,
  ]);

  const isSlugNumber = !isNaN(Number(chainSlug));

  const router = useRouter();

  const activeTab = router.query?.paths?.[2] || "overview";
  const contractQuery = useContract(contractAddress);
  const requiresImport = !!useSingleQueryParam("import");
  const [manuallyImported, setManuallyImported] = useState(false);

  useEffect(() => {
    setManuallyImported(false);
    // when this changes we need to reset the import state
  }, [chainSlug, contractAddress]);

  const showImportContract = useMemo(() => {
    // if we manually imported it don't show the import contract
    if (manuallyImported) {
      return false;
    }
    if (requiresImport) {
      return true;
    }
    if (contractQuery.isSuccess && !contractQuery.data?.abi) {
      return true;
    }
    if (contractQuery.isError) {
      return true;
    }
    if (contractQuery.errorUpdateCount > 0 && !contractQuery.data?.abi) {
      return true;
    }
    return false;
  }, [
    contractQuery.data?.abi,
    contractQuery.errorUpdateCount,
    contractQuery.isError,
    contractQuery.isSuccess,
    manuallyImported,
    requiresImport,
  ]);

  if (chainNotFound) {
    return (
      <HomepageSection>
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
              if (chainSlug === network.slug) {
                setChainNotFound(false);
              }
            }}
          />
        </Box>
      </HomepageSection>
    );
  }

  if (showImportContract) {
    return (
      <ImportContract
        // key is used to force remounting of the component when chain or contract address changes
        key={`${chainSlug}/${contractAddress}`}
        contractAddress={contractAddress}
        chain={chain}
        autoImport={!!requiresImport}
        onImport={() => {
          // stop showing import contract
          setManuallyImported(true);

          // remove search query param from url without reloading the page or triggering change in router
          const url = new URL(window.location.href);
          window.history.replaceState(null, document.title, url.pathname);

          // refetch contract query
          contractQuery.refetch();
        }}
      />
    );
  }

  if (contractQuery.isLoading) {
    return (
      <Flex h="100%" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Flex>
    );
  }
  return (
    <>
      <ContractHeader contractAddress={contractAddress} />
      <ContractTabRouter address={contractAddress} path={activeTab} />
    </>
  );
};

export default EVMContractPage;
EVMContractPage.pageId = PageId.DeployedContract;
EVMContractPage.getLayout = (page, props: EVMContractProps) => {
  // app layout has to come first in both getLayout and fallback
  return (
    <AppLayout
      layout={"custom-contract"}
      dehydratedState={props.dehydratedState}
      // has to be passed directly because the provider can not be above app layout in the tree
      contractInfo={props.contractInfo}
    >
      {page}
    </AppLayout>
  );
};

// app layout has to come first in both getLayout and fallback
EVMContractPage.fallback = (
  <AppLayout layout={"custom-contract"}>
    <Flex h="100%" justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  </AppLayout>
);

// server side ---------------------------------------------------------------

const { slugToChain } = getAllChainRecords();
export const getStaticProps: GetStaticProps<EVMContractProps> = async (ctx) => {
  const [chainSlug, contractAddress] = ctx.params?.paths as string[];
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(ensQuery(contractAddress));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      contractInfo: {
        chainSlug,
        contractAddress,
        chain: chainSlug in slugToChain ? slugToChain[chainSlug] : null,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    fallback: true,
    paths: [],
  };
};
