import { Flex } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { ComponentWithChildren } from "types/component-with-children";
import { OptimismHero } from "components/drops/OptimismHero";
import { OptimismFaq } from "components/drops/OptimismFAQ";

const DropsOptimismPage: ThirdwebNextPage = () => {
  const title = "Mint your Superchain Builder NFT on Optimism";
  const description =
    "Claim a free Superchain Builder NFT on OP Mainnet by deploying a contract on OP Goerli. Claim here.";

  return (
    <DropsOptimismSDK chainId={420}>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              url: `${getAbsoluteUrl()}/assets/og-image/drops-optimism.png`,
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
        <OptimismHero />
        <OptimismFaq />
      </Flex>
    </DropsOptimismSDK>
  );
};

export default DropsOptimismPage;
DropsOptimismPage.pageId = PageId.DropsOptimism;
DropsOptimismPage.getLayout = (page, props) => {
  return (
    <AppLayout
      layout={"custom-contract"}
      noSEOOverride
      dehydratedState={props.dehydratedState}
    >
      {page}
    </AppLayout>
  );
};

interface DropsOptimismSDKProps {
  chainId: number;
}

export const DropsOptimismSDK: ComponentWithChildren<DropsOptimismSDKProps> = ({
  chainId,
  children,
}) => {
  return (
    <CustomSDKContext
      desiredChainId={chainId}
      options={{
        gasless: {
          openzeppelin: {
            relayerUrl:
              "https://optimism.relayer.thirdweb.com/47460e34d71381d25840b41ec35b5f9b?format=oz",
          },
        },
      }}
    >
      {children}
    </CustomSDKContext>
  );
};
