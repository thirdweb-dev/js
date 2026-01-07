import type { Metadata } from "next";
import "@workspace/ui/global.css";
import type { SupportedFiatCurrency } from "thirdweb/react";
import { isValidCurrency } from "../_common/isValidCurrency";
import {
  onlyAddress,
  onlyNumber,
  parseQueryParams,
} from "../_common/parseQueryParams";
import { BridgeProvidersLite } from "../(general)/components/client/Providers.client";
import { BuyWidgetEmbed } from "./BuyWidgetEmbed.client";

const title = "thirdweb Buy: Purchase Crypto with Ease";
const description =
  "Buy crypto tokens with credit card or other payment methods. Simple and secure purchases with thirdweb.";

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

  // Token params
  const chainId = parseQueryParams(searchParams.chain, onlyNumber);
  const tokenAddress = parseQueryParams(searchParams.tokenAddress, onlyAddress);
  const amount = parseQueryParams(searchParams.amount, (v) => v);

  // Optional params
  const showThirdwebBranding = parseQueryParams(
    searchParams.showThirdwebBranding,
    // biome-ignore lint/complexity/noUselessTernary: this is easier to understand
    (v) => (v === "false" ? false : true),
  );

  const theme =
    parseQueryParams(searchParams.theme, (v) =>
      v === "light" ? "light" : "dark",
    ) || "dark";

  const currency = parseQueryParams(searchParams.currency, (v) =>
    isValidCurrency(v) ? (v as SupportedFiatCurrency) : undefined,
  );

  // Metadata params
  const widgetTitle = parseQueryParams(searchParams.title, (v) => v);
  const widgetDescription = parseQueryParams(
    searchParams.description,
    (v) => v,
  );
  const image = parseQueryParams(searchParams.image, (v) => v);

  // Payment params
  const paymentMethods = parseQueryParams(searchParams.paymentMethods, (v) => {
    if (v === "crypto" || v === "card") {
      return [v] as ("crypto" | "card")[];
    }
    return undefined;
  });

  const buttonLabel = parseQueryParams(searchParams.buttonLabel, (v) => v);
  const receiverAddress = parseQueryParams(searchParams.receiver, onlyAddress);
  const country = parseQueryParams(searchParams.country, (v) => v);

  return (
    <BridgeProvidersLite forcedTheme={theme}>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <BuyWidgetEmbed
          chainId={chainId}
          tokenAddress={tokenAddress}
          amount={amount}
          showThirdwebBranding={showThirdwebBranding}
          theme={theme}
          currency={currency}
          title={widgetTitle}
          description={widgetDescription}
          image={image}
          paymentMethods={paymentMethods}
          buttonLabel={buttonLabel}
          receiverAddress={receiverAddress}
          country={country}
        />
      </div>
    </BridgeProvidersLite>
  );
}
