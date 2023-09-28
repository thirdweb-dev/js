import { useAllProgramsList } from "@3rdweb-sdk/react";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";
import { Container, Divider, Flex } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { AppLayout } from "components/app-layouts/app";
import { DeployedPrograms } from "components/contract-components/tables/deployed-programs";
import { PageId } from "page-id";
import { useEffect, useState } from "react";
import { Card, Heading, Text } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

/**
 *
 * @TODO
 * Initially the FTUX is shown, then the contracts are shown. This creates a flash of wrong content.
 * To fix this, we need to hold off rendering either the FTUX or the contracts until we know which one to show.
 */

const Programs: ThirdwebNextPage = () => {
  const { publicKey } = useWallet();

  /** put the component is loading state for sometime to avoid layout shift */
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, []);

  const allProgramAccounts = useAllProgramsList(publicKey?.toBase58());

  return (
    <ClientOnly fadeInDuration={600} ssr={null}>
      {!isLoading && (
        <>
          {publicKey ? (
            <DeployedPrograms programListQuery={allProgramAccounts} />
          ) : (
            <Container maxW="lg">
              <Card p={6} as={Flex} flexDir="column" gap={2}>
                <Heading as="h2" size="title.sm">
                  Please connect your wallet
                </Heading>
                <Text>
                  In order to interact with your contracts you need to connect a
                  Solana compatible wallet.
                </Text>
                <Divider my={4} />
                <CustomConnectWallet ecosystem="solana" />
              </Card>
            </Container>
          )}
        </>
      )}
    </ClientOnly>
  );
};

Programs.getLayout = (page, props) => (
  <AppLayout ecosystem="solana" {...props}>
    {page}
  </AppLayout>
);
Programs.pageId = PageId.Programs;

export default Programs;
