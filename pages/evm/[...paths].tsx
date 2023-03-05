import {
  EVMContractInfo,
  useEVMContractInfo,
  useSetEVMContractInfo,
} from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Divider,
  Flex,
  Icon,
  IconButton,
  Image,
  Skeleton,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { DehydratedState, QueryClient, dehydrate } from "@tanstack/react-query";
import { useContract, useContractMetadata } from "@thirdweb-dev/react";
import { AppLayout } from "components/app-layouts/app";
import { ExtensionDetectedState } from "components/buttons/ExtensionDetectButton";
import { ConfigureNetworks } from "components/configure-networks/ConfigureNetworks";
import { ensQuery } from "components/contract-components/hooks";
import { ImportContract } from "components/contract-components/import-contract";
import { ContractHeader } from "components/custom-contract/contract-header";
import {
  SIDEBAR_WIDTH,
  SideBarTunnel,
} from "components/layout/app-shell/sidebar";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { useContractRouteConfig } from "contract-ui/hooks/useRouteConfig";
import { ConditionsNotSet } from "contract-ui/tabs/claim-conditions/components/conditions-not-set";
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
import { FiMenu } from "react-icons/fi";
import { Heading, Link, Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";
import { getAllChainRecords } from "utils/allChainsRecords";
import { ThirdwebNextPage } from "utils/types";
import { shortenIfAddress } from "utils/usedapp-external";

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
  const contractMetadataQuery = useContractMetadata(contractQuery.contract);
  const requiresImport = !!useSingleQueryParam("import");
  const autoAddToDashboard = !!useSingleQueryParam("add");
  const [manuallyImported, setManuallyImported] = useState(false);
  const routes = useContractRouteConfig(contractAddress);

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === activeTab),
    [activeTab, routes],
  );

  const addToDashboard = useAddContractMutation();

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

  if (showImportContract) {
    return (
      <ImportContract
        // key is used to force remounting of the component when chain or contract address changes
        key={`${chainSlug}/${contractAddress}`}
        contractAddress={contractAddress}
        chain={chain}
        autoImport={!!requiresImport}
        onImport={async () => {
          // stop showing import contract
          setManuallyImported(true);

          if (autoAddToDashboard && chain?.chainId) {
            // add to dashboard
            try {
              await addToDashboard.mutateAsync({
                chainId: chain.chainId,
                contractAddress,
              });
            } catch (e) {
              // failed to add to dashboard
            }
          }

          // remove search query param from url without reloading the page or triggering change in router
          const url = new URL(window.location.href);
          window.history.replaceState(null, document.title, url.pathname);

          // refetch contract query
          contractQuery.refetch();
        }}
      />
    );
  }
  return (
    <>
      <Flex direction="column" w="100%">
        <ContractHeader contractAddress={contractAddress} />
        <ContractSidebar
          contractAddress={contractAddress}
          contractMetadataQuery={contractMetadataQuery}
          routes={routes}
          activeRoute={activeRoute}
        />
        <Container pt={8} maxW="container.page">
          <ConditionsNotSet address={contractAddress} />
          {activeRoute?.component && (
            <activeRoute.component contractAddress={contractAddress} />
          )}
        </Container>
      </Flex>
    </>
  );
};

type ContractSidebarProps = {
  contractAddress: string;
  contractMetadataQuery: ReturnType<typeof useContractMetadata>;
  routes: ReturnType<typeof useContractRouteConfig>;
  activeRoute?: ReturnType<typeof useContractRouteConfig>[number];
};

const ContractSidebar: React.FC<ContractSidebarProps> = ({
  contractAddress,
  contractMetadataQuery,
  routes,
  activeRoute,
}) => {
  const openState = useDisclosure();
  return (
    <SideBarTunnel>
      <>
        <Box
          zIndex="sticky"
          position="sticky"
          top={0}
          p={{ base: 0, md: 8 }}
          w={{ base: "full", md: SIDEBAR_WIDTH }}
        >
          <Flex
            display={{ base: "flex", md: "none" }}
            align="center"
            justify="space-between"
            p={3}
          >
            <NavLink
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openState.onToggle();
              }}
              href={activeRoute?.path?.replace("overview", "") || ""}
              extensionDetectedState={activeRoute?.isEnabled}
            >
              {activeRoute?.title}
            </NavLink>

            <IconButton
              onClick={() => {
                openState.onToggle();
              }}
              aria-label="toggle menu"
              size="sm"
              variant="ghost"
              icon={<Icon as={FiMenu} />}
            />
          </Flex>
          <Box
            position={{ base: "absolute", md: "relative" }}
            maxH={{ base: openState.isOpen ? "100vh" : "0px", md: "100%" }}
            bg="backgroundHighlight"
            transition="max-height 0.2s ease-in-out"
            overflow={{ base: "hidden", md: "visible" }}
            w="full"
            mb={{ base: 3, md: 0 }}
            px={{ base: 3, md: 0 }}
            mt={0}
          >
            <Divider mb={3} display={{ base: "block", md: "none" }} />
            <NavLinkSection
              title={
                <Skeleton as="span" isLoaded={contractMetadataQuery.isSuccess}>
                  {contractMetadataQuery.data?.name ||
                    shortenIfAddress(contractAddress)}
                </Skeleton>
              }
              links={routes
                .filter((r) => r.isDefault)
                .map((r) => ({
                  title: r.title,
                  href: `/${r.path.replace("overview", "")}`,
                  onClick: () => {
                    openState.onClose();
                  },
                }))}
            />
            <NavLinkSection
              title={"Extensions"}
              icon={
                <Image
                  src="/assets/dashboard/extension-check.svg"
                  alt="Extension"
                  objectFit="contain"
                />
              }
              links={routes
                .filter((r) => !r.isDefault)
                .map((r) => ({
                  title: r.title,
                  href: `/${r.path}`,
                  extensionDetectedState: r.isEnabled,
                  onClick: () => {
                    openState.onClose();
                  },
                }))}
            />
          </Box>
        </Box>
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          top="200px"
          bottom={0}
          right={0}
          left={0}
          backdropFilter={openState.isOpen ? "blur(5px)" : undefined}
          transition="backdrop-filter 0.2s ease-in-out"
        />
      </>
    </SideBarTunnel>
  );
};

type NavLinkSectionprops = {
  title: JSX.Element | string;
  icon?: JSX.Element;
  links: Array<{
    href: string;
    title: string;
    extensionDetectedState?: ExtensionDetectedState;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
};

const NavLinkSection: React.FC<NavLinkSectionprops> = ({
  icon,
  title,
  links,
}) => {
  return (
    <Flex direction="column" mb={4}>
      <Flex mb={2} gap={2} align="center">
        {icon && <Box ml={-1.5}>{icon}</Box>}
        <Text noOfLines={1} as="label" size="body.md" color="faded">
          {title}
        </Text>
      </Flex>
      {links.map((link) => (
        <NavLink key={link.href} {...link}>
          {link.title}
        </NavLink>
      ))}
    </Flex>
  );
};

type NavLinkProps = {
  href: string;
  extensionDetectedState?: ExtensionDetectedState;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NavLink: ComponentWithChildren<NavLinkProps> = ({
  children,
  href,
  extensionDetectedState,
  onClick,
}) => {
  const { query } = useRouter();
  const [computedBasePath, tabHref] = useMemo(() => {
    const [network, address, tab = ""] = (
      (query.paths as string[]) || []
    ).filter((c) => c !== "evm" && c !== "solana");
    return [`/${network}/${address}`, tab] as const;
  }, [query.paths]);

  const isActive = tabHref === href.replace("/", "");

  if (extensionDetectedState === "disabled") {
    return null;
  }
  return (
    <Link
      onClick={onClick}
      pointerEvents={extensionDetectedState === "loading" ? "none" : "auto"}
      href={computedBasePath + href}
      position="relative"
      pl={3}
      borderLeftWidth="2px"
      _dark={{
        borderColor: isActive ? "primary.500" : "rgba(255,255,255,.07)",
        _hover: {
          borderColor: isActive ? "primary.500" : "rgba(255,255,255,.7)",
        },
      }}
      _light={{
        borderColor: isActive ? "primary.500" : "rgba(0,0,0,.07)",
        _hover: {
          borderColor: isActive ? "primary.500" : "rgba(0,0,0,.3)",
        },
      }}
      textDecor="none!important"
      role="group"
      height={7}
      display="grid"
      alignItems="center"
    >
      <Skeleton isLoaded={extensionDetectedState !== "loading"}>
        <Heading
          noOfLines={1}
          p={0}
          m={0}
          as="span"
          lineHeight={1.5}
          fontSize="14px"
          size="label.md"
          transition="opacity 0.2s"
          fontWeight={isActive ? 700 : 400}
          opacity={isActive ? 1 : 0.7}
          _groupHover={{
            opacity: 1,
          }}
        >
          {children}
        </Heading>
      </Skeleton>
    </Link>
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
