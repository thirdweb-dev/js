import { Suspense, lazy } from "react";
import { CodeLoading } from "../../../../components/code/code.client";
import type { PayEmbedPlaygroundOptions } from "./types";

const CodeClient = lazy(
  () => import("../../../../components/code/code.client"),
);

export function CodeGen(props: {
  options: PayEmbedPlaygroundOptions;
}) {
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          code={getCode(props.options)}
          lang="tsx"
          loader={<CodeLoading />}
          // Need to add max-h in both places - TODO figure out a better way
          className="xl:h-[calc(100vh-100px)]"
          scrollableClassName="xl:h-[calc(100vh-100px)]"
        />
      </Suspense>
    </div>
  );
}

function getCode(options: PayEmbedPlaygroundOptions) {
  const walletCodes: string[] = [];
  const imports = {
    react: ["PayEmbed"] as string[],
    thirdweb: [] as string[],
    wallets: [] as string[],
    chains: [] as string[],
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

  // Generate chain reference code
  let chainCode: string;
  if (isCustomChain && options.payOptions.buyTokenChain?.id) {
    chainCode = `defineChain(${options.payOptions.buyTokenChain.id})`;
  } else {
    chainCode = "base";
  }

  for (const wallet of options.connectOptions.walletIds) {
    walletCodes.push(`createWallet("${wallet}")`);
  }

  if (options.connectOptions.walletIds.length > 0) {
    imports.wallets.push("createWallet");
  }

  let themeProp: string | undefined;
  if (
    options.theme.type === "dark" &&
    Object.keys(options.theme.darkColorOverrides || {}).length > 0
  ) {
    themeProp = `darkTheme({
      colors: ${JSON.stringify(options.theme.darkColorOverrides)},
    })`;
    imports.react.push("darkTheme");
  }

  if (options.theme.type === "light") {
    if (Object.keys(options.theme.lightColorOverrides || {}).length > 0) {
      themeProp = `lightTheme({
        colors: ${JSON.stringify(options.theme.lightColorOverrides)},
      })`;
      imports.react.push("lightTheme");
    } else {
      themeProp = quotes("light");
    }
  }

  if (options.connectOptions.enableAccountAbstraction) {
    imports.chains.push("sepolia");
  }

  // Generate payOptions based on the mode
  let payOptionsCode = "{";

  if (options.payOptions.title || options.payOptions.image) {
    payOptionsCode += `
        metadata: {
          ${options.payOptions.title ? `name: ${quotes(options.payOptions.title)},` : ""}
          ${options.payOptions.image ? `image: ${quotes(options.payOptions.image)},` : ""}
        },`;
  }

  // Add mode-specific options
  if (options.payOptions.mode) {
    payOptionsCode += `
        mode: "${options.payOptions.mode}",`;

    // Add buyWithCrypto and buyWithFiat if they're set to false
    if (options.payOptions.buyWithCrypto === false) {
      payOptionsCode += `
        buyWithCrypto: false,`;
    }

    if (options.payOptions.buyWithFiat === false) {
      payOptionsCode += `
        buyWithFiat: false,`;
    }

    if (options.payOptions.mode === "fund_wallet" || !options.payOptions.mode) {
      payOptionsCode += `
        prefillBuy: {
          chain: ${chainCode},
          amount: ${options.payOptions.buyTokenAmount ? quotes(options.payOptions.buyTokenAmount) : '"0.01"'},
          ${options.payOptions.buyTokenInfo ? `token: ${JSON.stringify(options.payOptions.buyTokenInfo)},` : ""}
        },`;
    } else if (options.payOptions.mode === "direct_payment") {
      payOptionsCode += `
        paymentInfo: {
          chain: ${chainCode},
          sellerAddress: ${options.payOptions.sellerAddress ? quotes(options.payOptions.sellerAddress) : '"0x0000000000000000000000000000000000000000"'},
          amount: ${options.payOptions.buyTokenAmount ? quotes(options.payOptions.buyTokenAmount) : '"0.01"'},
          ${options.payOptions.buyTokenInfo ? `token: ${JSON.stringify(options.payOptions.buyTokenInfo)},` : ""}
        },`;
    } else if (options.payOptions.mode === "transaction") {
      payOptionsCode += `
        transaction: claimTo({
                contract: myNftContract,
                quantity: 1n,
                tokenId: 0n,
                to: "0x...",
              }),`;
    }
  }

  payOptionsCode += `
      }`;

  const accountAbstractionCode = options.connectOptions.enableAccountAbstraction
    ? `\n        accountAbstraction: {
          chain: ${isCustomChain ? `defineChain(${options.payOptions.buyTokenChain?.id})` : "base"},
          sponsorGas: true,
        }`
    : "";

  const connectOptionsCode = `${accountAbstractionCode ? `{${accountAbstractionCode}\n      }` : ""}`;

  return `\
import { createThirdwebClient } from "thirdweb";
${imports.react.length > 0 ? `import { ${imports.react.join(", ")} } from "thirdweb/react";` : ""}
${imports.thirdweb.length > 0 ? `import { ${imports.thirdweb.join(", ")} } from "thirdweb";` : ""}
${imports.wallets.length > 0 ? `import { ${imports.wallets.join(", ")} } from "thirdweb/wallets";` : ""}
${imports.chains.length > 0 ? `import { ${imports.chains.join(", ")} } from "thirdweb/chains";` : ""}

const client = createThirdwebClient({
  clientId: "....",
});

function Example() {
  return (
    <PayEmbed
      client={client}
      payOptions={${payOptionsCode}}${connectOptionsCode ? `\n      connectOptions={${connectOptionsCode}}` : ""}${themeProp ? `\n      theme={${themeProp}}` : ""}
    />
  );
}`;
}

function quotes(value: string) {
  return `"${value}"`;
}
