import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { CTA } from "components/faucet/CTA";
import { FaqSection } from "components/faucet/FAQSection";
import { FormComponent } from "components/faucet/FormComponent";
import { NextSeo } from "next-seo";
// import dynamic from "next/dynamic";
import { PageId } from "page-id";
import { useState } from "react";
import { Heading } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

const SolanaFaucet: ThirdwebNextPage = () => {
  const [transactionLink, setTransactionLink] = useState("");

  return (
    <>
      <NextSeo
        title="Solana (SOL) Faucet | thirdweb"
        description="Get Solana (SOL) devnet tokens for free—using thirdweb's fast and reliable Solana Faucet for blockchain developers to build web3 apps."
        openGraph={{
          title:
            "Get Solana devnet tokens for free—using our fast and reliable Solana Faucet for blockchain developers building web3 apps. Powered by thirdweb.",
          url: `https://thirdweb.com/faucet/solana`,
        }}
      />
      <Flex
        flexDir="column"
        maxW="900px"
        w="full"
        mx="auto"
        px={{ base: 0, md: 4 }}
      >
        <Heading as="h1">Solana (SOL) Faucet</Heading>
        <Heading fontSize="20px" my="4" as="h2">
          Get Solana (SOL) devnet tokens for free to build your blockchain app.
        </Heading>
        {!transactionLink ? (
          <FormComponent
            transactionLink={transactionLink}
            setTransactionLink={setTransactionLink}
          />
        ) : (
          <CTA transactionLink={transactionLink} />
        )}

        <FaqSection />
      </Flex>
    </>
  );
};

// const AppLayout = dynamic(
//   async () => (await import("components/app-layouts/app")).AppLayout,
// );

SolanaFaucet.getLayout = (page, props) => (
  <AppLayout {...props} ecosystem="solana">
    {page}
  </AppLayout>
);

SolanaFaucet.pageId = PageId.FaucetSolana;

export default SolanaFaucet;
