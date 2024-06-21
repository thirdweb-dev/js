import { getAbsoluteUrl } from "lib/vercel-utils";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const title = "Transaction Farcaster Frame on Base | thirdweb";
const description =
  "This is an example transaction frame on Base for users to mint an NFT or perform an onchain transaction, directly on Farcaster. Get started with thirdweb.";

const ogImageUrl = `${getAbsoluteUrl()}/assets/og-image/tx-frame-og-image.png`;

const BaseFramePage = () => {
  const router = useRouter();

  // this can move to RSC logic (depending on user agent likely)
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    router.push("https://blog.thirdweb.com/guides/farcaster-transaction-frame");
  }, [router]);

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
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
      />
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={ogImageUrl} />
        <meta property="fc:frame:button:1" content="Mint NFT" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta
          property="fc:frame:button:1:target"
          content={`${getAbsoluteUrl()}/api/frame/base/get-tx-frame`}
        />
      </Head>
    </>
  );
};

export default BaseFramePage;
