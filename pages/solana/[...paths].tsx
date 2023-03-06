import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import { DehydratedState } from "@tanstack/react-query";
import { useProgram, useProgramMetadata } from "@thirdweb-dev/react/solana";
import { AppLayout } from "components/app-layouts/app";
import {
  SolanaProgramInfo,
  SolanaProgramInfoProvider,
} from "contexts/solana-program";
import { DropNotReady } from "contract-ui/tabs/claim-conditions/components/drop-not-ready";
import { ContractProgramSidebar } from "core-ui/sidebar/detail-page";
import { isPossibleSolanaAddress } from "lib/address-utils";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { PageId } from "page-id";
import { ProgramMetadata } from "program-ui/common/program-metadata";
import { useProgramRouteConfig } from "program-ui/hooks/useRouteConfig";
import { useMemo } from "react";
import { getSolNetworkFromNetworkPath } from "utils/solanaUtils";
import { ThirdwebNextPage } from "utils/types";

type SolanaProgramProps = {
  programInfo: SolanaProgramInfo;
  dehydratedState: DehydratedState;
};

const SolanaProgramPage: ThirdwebNextPage = (props: SolanaProgramProps) => {
  const { programAddress } = props.programInfo;
  const router = useRouter();

  const programQuery = useProgram(programAddress);
  const programMetadataQuery = useProgramMetadata(programQuery.program);
  const activeTab = router.query?.paths?.[2] || "overview";

  const routes = useProgramRouteConfig(programAddress);

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === activeTab),
    [activeTab, routes],
  );

  return (
    <Flex direction="column" w="100%">
      <ProgramMetadata
        address={programAddress}
        metadataQuery={programMetadataQuery}
        programQuery={programQuery}
      />
      <ContractProgramSidebar
        address={programAddress}
        metadataQuery={programMetadataQuery}
        routes={routes}
        activeRoute={activeRoute}
      />
      <Container maxW="container.page">
        <Box pt={8}>
          <DropNotReady address={programAddress} />
          {activeRoute?.component && (
            <activeRoute.component address={programAddress} />
          )}
        </Box>
      </Container>
    </Flex>
  );
};

export default SolanaProgramPage;
SolanaProgramPage.pageId = PageId.DeployedProgram;
SolanaProgramPage.getLayout = (page, pageProps: SolanaProgramProps) => {
  // app layout has to come first in both getLayout and fallback
  return (
    <AppLayout layout={"custom-contract"}>
      <SolanaProgramInfoProvider value={pageProps.programInfo}>
        {page}
      </SolanaProgramInfoProvider>
    </AppLayout>
  );
};

// TODO better skeleton
// app layout has to come first in both getLayout and fallback
SolanaProgramPage.fallback = (
  <AppLayout layout={"custom-contract"}>
    <Flex h="100%" justifyContent="center" alignItems="center">
      <Spinner size="xl" />
    </Flex>
  </AppLayout>
);

// server side ---------------------------------------------------------------
export const getStaticProps: GetStaticProps<SolanaProgramProps> = (ctx) => {
  const [slug, programAddress] = ctx.params?.paths as string[];
  const solNetwork = getSolNetworkFromNetworkPath(slug);

  if (
    !programAddress ||
    !isPossibleSolanaAddress(programAddress) ||
    !solNetwork
  ) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      dehydratedState: { mutations: [], queries: [] },
      programInfo: {
        programAddress,
        network: solNetwork,
        slug,
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
