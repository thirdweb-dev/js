import type { Metadata } from "next";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { PageLayout } from "../../../components/blocks/APIHeader";
import PayEmbedPlayground from "./embed/page";

export const metadata: Metadata = {
  description:
    "The easiest way for users to transact in your app. Onramp users, pay with any token and generate revenue for each user transaction. Integrate for free.",
  metadataBase,
  title:
    "Integrate Fiat & Cross-Chain Crypto Payments | thirdweb Universal Bridge",
};

export default function Page(props: {
  searchParams: Promise<{ tab: string }>;
}) {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            Onramp users with credit card &amp; cross-chain crypto payments —
            and generate revenue for each user transaction.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/pay/get-started?utm_source=playground"
        title="Universal Bridge UI component"
      >
        <PayEmbedPlayground searchParams={props.searchParams} />
      </PageLayout>
    </ThirdwebProvider>
  );
}
