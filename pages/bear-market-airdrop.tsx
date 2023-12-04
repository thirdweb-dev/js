import { Flex } from "@chakra-ui/react";
import { Polygon } from "@thirdweb-dev/chains";
import { AppLayout } from "components/app-layouts/app";
import { FAQ } from "components/bear-market-airdrop/Blocks/FAQ";
import { Hero } from "components/bear-market-airdrop/Blocks/Hero";
import { PrizesDisplay } from "components/bear-market-airdrop/Blocks/Prizes";
import { Why } from "components/bear-market-airdrop/Blocks/Why";
import { Aurora } from "components/homepage/Aurora";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";

const desiredChain = Polygon;

const BearMarketAirdropPage: ThirdwebNextPage = () => {
  const title = "Bear Market Builders Airdrop";
  const description =
    "thirdweb is giving back to brave builders that deployed contracts during the bear market, in 2022.";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/bear-market-airdrop.png`,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
      />
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        mx="auto"
        mt={-8}
        pb={8}
        overflowX="hidden"
      >
        <HomepageSection>
          <Aurora
            pos={{ top: "0%", left: "50%" }}
            size={{ width: "1400px", height: "1400px" }}
            color="hsl(289deg 78% 30% / 35%)"
          />
          <Hero desiredChain={desiredChain} />
        </HomepageSection>
        <PrizesDisplay />
        <Why />
        <FAQ />
      </Flex>
    </>
  );
};

export default BearMarketAirdropPage;
BearMarketAirdropPage.pageId = PageId.BearMarketAirdrop;
BearMarketAirdropPage.getLayout = (page, props) => {
  return (
    <AppLayout
      layout={"custom-contract"}
      noSEOOverride
      dehydratedState={props.dehydratedState}
    >
      <BearMarketBuilderSDK>{page}</BearMarketBuilderSDK>
    </AppLayout>
  );
};

interface BearMarketBuilderSDKProps {
  children: React.ReactNode;
}

export const BearMarketBuilderSDK: React.FC<BearMarketBuilderSDKProps> = ({
  children,
}) => {
  // TODO bring back gasless later
  // const forwarderAddress = "0x409D530A6961297ECE29121dbEE2c917c3398659";

  return (
    <CustomSDKContext
      desiredChainId={desiredChain.chainId}
      // TODO bring back gasless later
      // options={{
      //   gasless: {
      //     openzeppelin: {
      //       relayerUrl:
      //         "https://api.defender.openzeppelin.com/autotasks/b1b8a5d1-bdb4-414b-afd3-4411a1da5b05/runs/webhook/7d6a1834-dd33-4b7b-8af4-b6b4719a0b97/Szsk8cMMDDshUDEHyMPQ3x",
      //       relayerForwarderAddress: forwarderAddress,
      //       useEOAForwarder: false,
      //     },
      //     experimentalChainlessSupport: true,
      //   },
      // }}
    >
      {children}
    </CustomSDKContext>
  );
};
