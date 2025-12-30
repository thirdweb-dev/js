import type { Metadata } from "next";
import "@workspace/ui/global.css";
import { InlineCode } from "@workspace/ui/components/code/inline-code";
import { AlertTriangleIcon } from "lucide-react";
import type { SupportedFiatCurrency } from "thirdweb/react";
import { NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID } from "@/constants/public-envs";
import { isValidCurrency } from "../_common/isValidCurrency";
import {
  onlyAddress,
  onlyNumber,
  parseQueryParams,
} from "../_common/parseQueryParams";
import { BridgeProviders } from "../(general)/components/client/Providers.client";
import { CheckoutWidgetEmbed } from "./CheckoutWidgetEmbed.client";

const title = "thirdweb Checkout: Accept Crypto & Fiat Payments";
const description =
  "Accept fiat or crypto payments on any chain—direct to your wallet. Instant checkout, webhook support, and full control over post-sale actions.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function Page(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  // Required params
  const chainId = parseQueryParams(searchParams.chain, onlyNumber);
  const amount = parseQueryParams(searchParams.amount, (v) => v);
  const seller = parseQueryParams(searchParams.seller, onlyAddress);

  // Optional params
  const tokenAddress = parseQueryParams(searchParams.tokenAddress, onlyAddress);
  const title = parseQueryParams(searchParams.title, (v) => v);
  const productDescription = parseQueryParams(
    searchParams.description,
    (v) => v,
  );
  const image = parseQueryParams(searchParams.image, (v) => v);
  const buttonLabel = parseQueryParams(searchParams.buttonLabel, (v) => v);
  const feePayer = parseQueryParams(searchParams.feePayer, (v) =>
    v === "seller" || v === "user" ? v : undefined,
  );
  const country = parseQueryParams(searchParams.country, (v) => v);

  const showThirdwebBranding = parseQueryParams(
    searchParams.showThirdwebBranding,
    (v) => v !== "false",
  );

  const theme =
    parseQueryParams(searchParams.theme, (v) =>
      v === "light" ? "light" : "dark",
    ) || "dark";

  const currency = parseQueryParams(searchParams.currency, (v) =>
    isValidCurrency(v) ? (v as SupportedFiatCurrency) : undefined,
  );

  const paymentMethods = parseQueryParams(searchParams.paymentMethods, (v) => {
    if (v === "crypto" || v === "card") {
      return [v] as ("crypto" | "card")[];
    }

    return undefined;
  });

  // Validate required params
  if (!chainId || !amount || !seller) {
    return (
      <Providers theme={theme}>
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl">
            <div className="p-2.5 inline-flex rounded-full bg-background mb-4 border">
              <AlertTriangleIcon className="size-5 text-destructive-text" />
            </div>
            <h2 className="mb-2 font-semibold text-destructive-text text-lg">
              Invalid Configuration
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              The following query parameters are required but are missing:
            </p>
            <ul className="mt-2 text-left text-muted-foreground text-sm space-y-2">
              {!chainId && (
                <li>
                  • <InlineCode code="chain" /> - Chain ID (e.g., 1, 8453,
                  42161)
                </li>
              )}
              {!amount && (
                <li>
                  • <InlineCode code="amount" /> - Amount to charge (e.g.,
                  "0.01")
                </li>
              )}
              {!seller && (
                <li>
                  • <InlineCode code="seller" /> - Seller wallet address
                </li>
              )}
            </ul>
          </div>
        </div>
      </Providers>
    );
  }

  return (
    <Providers theme={theme}>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <CheckoutWidgetEmbed
          chainId={chainId}
          amount={amount}
          seller={seller}
          tokenAddress={tokenAddress}
          name={title}
          description={productDescription}
          image={image}
          buttonLabel={buttonLabel}
          feePayer={feePayer}
          country={country}
          showThirdwebBranding={showThirdwebBranding}
          theme={theme}
          currency={currency}
          paymentMethods={paymentMethods}
        />
      </div>
    </Providers>
  );
}

function Providers({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  if (!NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID) {
    throw new Error("NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID is not set");
  }
  return (
    <BridgeProviders
      clientId={NEXT_PUBLIC_CHECKOUT_IFRAME_CLIENT_ID}
      forcedTheme={theme}
    >
      {children}
    </BridgeProviders>
  );
}
