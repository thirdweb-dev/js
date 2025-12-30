import { lazy, Suspense } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import {
  quotes,
  stringifyImports,
  stringifyProps,
} from "../../../lib/code-gen";
import { buildCheckoutIframeUrl } from "./buildCheckoutIframeUrl";
import type { BridgeComponentsPlaygroundOptions } from "./types";

const CodeClient = lazy(() =>
  import("../../../components/code/code.client").then((m) => ({
    default: m.CodeClient,
  })),
);

function CodeLoading() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center bg-card border rounded-lg">
      <LoadingDots />
    </div>
  );
}

export function CodeGen(props: {
  widget: "buy" | "checkout" | "transaction";
  options: BridgeComponentsPlaygroundOptions;
}) {
  const isIframe =
    props.widget === "checkout" && props.options.integrationType === "iframe";

  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          className="grow"
          code={
            isIframe
              ? getIframeCode(props.options)
              : getCode(props.widget, props.options)
          }
          lang={isIframe ? "html" : "tsx"}
        />
      </Suspense>
    </div>
  );
}

function getIframeCode(options: BridgeComponentsPlaygroundOptions) {
  const src = buildCheckoutIframeUrl(options);

  return `\
<iframe
  src="${src}"
  height="700px"
  width="100%"
  style="border: 0;"
/>`;
}

function getCode(
  widget: "buy" | "checkout" | "transaction",
  options: BridgeComponentsPlaygroundOptions,
) {
  const componentName =
    widget === "buy"
      ? "BuyWidget"
      : widget === "checkout"
        ? "CheckoutWidget"
        : widget === "transaction"
          ? "TransactionWidget"
          : "";

  const imports = {
    "thirdweb/chains": [] as string[],
    "thirdweb/react": [componentName] as string[],
    thirdweb: ["createThirdwebClient", "defineChain"] as string[],
    "thirdweb/wallets": ["createWallet"] as string[],
  };

  let themeProp: string | undefined;
  if (
    options.theme.type === "dark" &&
    Object.keys(options.theme.darkColorOverrides || {}).length > 0
  ) {
    themeProp = `darkTheme({
      colors: ${JSON.stringify(options.theme.darkColorOverrides)},
    })`;
    imports["thirdweb/react"].push("darkTheme");
  }

  if (options.theme.type === "light") {
    if (Object.keys(options.theme.lightColorOverrides || {}).length > 0) {
      themeProp = `lightTheme({
        colors: ${JSON.stringify(options.theme.lightColorOverrides)},
      })`;
      imports["thirdweb/react"].push("lightTheme");
    } else {
      themeProp = quotes("light");
    }
  }

  const transaction =
    widget === "transaction"
      ? `claimTo({
contract: nftContract,
quantity: 1n,
to: account?.address || "",
tokenId: 2n,
})`
      : undefined;

  const props: Record<string, string | undefined | boolean> = {
    theme: themeProp,
    client: "client",
    description: options.payOptions.description
      ? quotes(options.payOptions.description)
      : undefined,
    image: options.payOptions.image
      ? quotes(options.payOptions.image)
      : undefined,
    name: options.payOptions.title
      ? quotes(options.payOptions.title)
      : undefined,
    paymentMethods:
      options.payOptions.paymentMethods.length === 2
        ? undefined
        : JSON.stringify(options.payOptions.paymentMethods),
    currency: options.payOptions.currency
      ? quotes(options.payOptions.currency)
      : undefined,
    chain: `defineChain(${options.payOptions.buyTokenChain.id})`,
    showThirdwebBranding:
      options.payOptions.showThirdwebBranding === false ? false : undefined,
    amount: options.payOptions.buyTokenAmount
      ? quotes(options.payOptions.buyTokenAmount)
      : undefined,
    tokenAddress: options.payOptions.buyTokenAddress
      ? quotes(options.payOptions.buyTokenAddress)
      : undefined,
    seller:
      widget === "checkout"
        ? quotes(options.payOptions.sellerAddress)
        : undefined,
    receiverAddress: options.payOptions.receiverAddress
      ? quotes(options.payOptions.receiverAddress)
      : undefined,
    buttonLabel: options.payOptions.buttonLabel
      ? quotes(options.payOptions.buttonLabel)
      : undefined,
    transaction: transaction,
  };

  return `\
${stringifyImports(imports)}

const client = createThirdwebClient({
  clientId: "....",
});

function Example() {
  return (
    <${componentName} ${stringifyProps(props)} />
  );
}`;
}
