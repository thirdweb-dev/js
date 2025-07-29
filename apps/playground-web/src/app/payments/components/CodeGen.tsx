import { lazy, Suspense } from "react";
import { CodeLoading } from "../../../components/code/code.client";
import type { BridgeComponentsPlaygroundOptions } from "./types";

const CodeClient = lazy(() => import("../../../components/code/code.client"));

export function CodeGen(props: { options: BridgeComponentsPlaygroundOptions }) {
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          className="grow"
          code={getCode(props.options)}
          lang="tsx"
          loader={<CodeLoading />}
        />
      </Suspense>
    </div>
  );
}

function getCode(options: BridgeComponentsPlaygroundOptions) {
  const imports = {
    chains: [] as string[],
    react: ["PayEmbed"] as string[],
    thirdweb: [] as string[],
    wallets: [] as string[],
  };

  // Check if we have a custom chain (not base chain which has id 8453)
  const isCustomChain =
    options.payOptions.buyTokenChain &&
    options.payOptions.buyTokenChain.id !== 8453;

  if (isCustomChain) {
    // Add defineChain to imports if using a custom chain
    imports.thirdweb.push("defineChain");
  } else {
    // Otherwise use the base chain
    imports.chains.push("base");
  }

  imports.wallets.push("createWallet");

  const componentName = (() => {
    switch (options.payOptions.widget) {
      case "buy":
        return "BuyWidget";
      case "checkout":
        return "CheckoutWidget";
      case "transaction":
        return "TransactionWidget";
      default:
        return "PayEmbed";
    }
  })();
  imports.react.push(componentName);
  imports.chains.push("defineChain");

  return `\
import { createThirdwebClient } from "thirdweb";
${imports.react.length > 0 ? `import { ${imports.react.join(", ")} } from "thirdweb/react";` : ""}
${imports.thirdweb.length > 0 ? `import { ${imports.thirdweb.join(", ")} } from "thirdweb";` : ""}

const client = createThirdwebClient({
  clientId: "....",
});

function Example() {
  return (
    <${componentName}
      client={client}
      chain={defineChain(${options.payOptions.buyTokenChain.id})}
      amount="${options.payOptions.buyTokenAmount}"${options.payOptions.buyTokenAddress ? `\n\t  tokenAddress="${options.payOptions.buyTokenAddress}"` : ""}${options.payOptions.sellerAddress ? `\n\t  seller="${options.payOptions.sellerAddress}"` : ""}${options.payOptions.title ? `\n\t  ${options.payOptions.widget === "checkout" ? "name" : "title"}="${options.payOptions.title}"` : ""}${options.payOptions.image ? `\n\t  image="${options.payOptions.image}"` : ""}${options.payOptions.description ? `\n\t  description="${options.payOptions.description}"` : ""}${options.payOptions.paymentMethods && options.payOptions.paymentMethods.length > 0 ? `\n\t  paymentMethods={${JSON.stringify(options.payOptions.paymentMethods)}}` : ""}${options.payOptions.currency ? `\n\t  currency="${options.payOptions.currency}"` : ""}${
        options.payOptions.widget === "transaction"
          ? `\n\t  transaction={claimTo({
        contract: nftContract,
        quantity: 1n,
        tokenId: 2n,
        to: account?.address || "",
      })}`
          : ""
      }
    />
  );
}`;
}
