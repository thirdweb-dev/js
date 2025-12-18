import { lazy, Suspense } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { quotes, stringifyImports, stringifyProps } from "@/lib/code-gen";
import { buildIframeUrl } from "./buildIframeUrl";
import type { BridgeWidgetPlaygroundOptions } from "./types";

const CodeClient = lazy(() =>
  import("../../../../components/code/code.client").then((m) => ({
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

export function CodeGen(props: { options: BridgeWidgetPlaygroundOptions }) {
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient
          className="grow"
          code={getCode(props.options)}
          lang={props.options.integrationType === "react" ? "tsx" : "html"}
        />
      </Suspense>
    </div>
  );
}

function getCode(options: BridgeWidgetPlaygroundOptions) {
  if (options.integrationType === "script") {
    return getCode_Script(options);
  }
  if (options.integrationType === "react") {
    return getCode_ReactComponent(options);
  }
  if (options.integrationType === "iframe") {
    return getCode_Iframe(options);
  }
  return "";
}

function getCode_Script(options: BridgeWidgetPlaygroundOptions) {
  const widgetOptions: Record<string, unknown> = {
    clientId: "your-thirdweb-client-id",
  };

  // Theme configuration
  if (options.theme.type === "light") {
    if (Object.keys(options.theme.lightColorOverrides || {}).length > 0) {
      widgetOptions.theme = {
        type: "light",
        ...options.theme.lightColorOverrides,
      };
    } else {
      widgetOptions.theme = "light";
    }
  } else {
    // dark theme
    if (Object.keys(options.theme.darkColorOverrides || {}).length > 0) {
      widgetOptions.theme = {
        type: "dark",
        ...options.theme.darkColorOverrides,
      };
    }
    // default is dark, so no need to set if no overrides
  }

  // Currency
  if (options.currency && options.currency !== "USD") {
    widgetOptions.currency = options.currency;
  }

  // Branding
  if (options.showThirdwebBranding === false) {
    widgetOptions.showThirdwebBranding = false;
  }

  // Buy tab options (for buyToken)
  if (options.prefill?.buyToken) {
    widgetOptions.buy = {
      chainId: options.prefill.buyToken.chainId,
      tokenAddress: options.prefill.buyToken.tokenAddress,
      amount: options.prefill.buyToken.amount,
    };
  }

  // Swap prefill options
  if (options.prefill?.buyToken || options.prefill?.sellToken) {
    widgetOptions.swap = {
      prefill: options.prefill,
    };
  }

  const optionsString = JSON.stringify(widgetOptions, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : `  ${line}`))
    .join("\n");

  return `\
<!-- Add this script in <head> -->
<script src="https://unpkg.com/thirdweb/dist/scripts/bridge-widget.js"></script>

<!-- Add a container element where you want to render the UI -->
<div id="bridge-widget-container"></div>

<!-- Initialize the widget at the end of <body> -->
<script>
  const container = document.querySelector("#bridge-widget-container");

  BridgeWidget.render(container, ${optionsString});
</script>`;
}

function getCode_ReactComponent(options: BridgeWidgetPlaygroundOptions) {
  const imports = {
    thirdweb: ["createThirdwebClient"] as string[],
    "thirdweb/react": ["BridgeWidget"] as string[],
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

  // Build buy prop for buyToken
  let buyProp: string | undefined;
  if (options.prefill?.buyToken) {
    buyProp = JSON.stringify(
      {
        chainId: options.prefill.buyToken.chainId,
        tokenAddress: options.prefill.buyToken.tokenAddress,
        amount: options.prefill.buyToken.amount,
      },
      null,
      2,
    );
  }

  // Build swap prop with prefill
  let swapProp: string | undefined;
  if (options.prefill?.buyToken || options.prefill?.sellToken) {
    swapProp = JSON.stringify(
      {
        prefill: {
          buyToken: options.prefill?.buyToken,
          sellToken: options.prefill?.sellToken,
        },
      },
      null,
      2,
    );
  }

  const props: Record<string, string | undefined | boolean> = {
    client: "client",
    theme: themeProp,
    buy: buyProp,
    swap: swapProp,
    currency:
      options.currency !== "USD" && options.currency
        ? quotes(options.currency)
        : undefined,
    showThirdwebBranding:
      options.showThirdwebBranding === false ? false : undefined,
  };

  return `\
${stringifyImports(imports)}

const client = createThirdwebClient({
  clientId: "your-thirdweb-client-id",
});

function Example() {
  return (
    <BridgeWidget ${stringifyProps(props)} />
  );
}`;
}

function getCode_Iframe(options: BridgeWidgetPlaygroundOptions) {
  const src = buildIframeUrl(options, "code");

  return `\
<iframe
  src="${src}"
  height="750px"
  width="100%"
  style="border: 0;"
/>`;
}
