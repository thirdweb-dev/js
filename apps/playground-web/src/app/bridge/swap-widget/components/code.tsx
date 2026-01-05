import { lazy, Suspense } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { quotes, stringifyImports, stringifyProps } from "@/lib/code-gen";
import { buildSwapIframeUrl } from "./buildSwapIframeUrl";
import type { SwapWidgetPlaygroundOptions } from "./types";

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

export function CodeGen(props: { options: SwapWidgetPlaygroundOptions }) {
  const code =
    props.options.integrationType === "iframe"
      ? getIframeCode(props.options)
      : getReactCode(props.options);

  const lang = props.options.integrationType === "iframe" ? "html" : "ts";

  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient className="grow" code={code} lang={lang} />
      </Suspense>
    </div>
  );
}

function getIframeCode(options: SwapWidgetPlaygroundOptions) {
  // Use "code" type to exclude persistTokenSelections from the generated code
  const iframeUrl = buildSwapIframeUrl(options, "code");

  return `<iframe
  src="${iframeUrl}"
  height="700px"
  width="100%"
  style="border: 0;"
/>`;
}

function getReactCode(options: SwapWidgetPlaygroundOptions) {
  const imports = {
    thirdweb: ["createThirdwebClient"] as string[],
    "thirdweb/react": ["SwapWidget"] as string[],
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

  const props: Record<string, string | undefined | boolean> = {
    theme: themeProp,
    prefill:
      options.prefill?.buyToken || options.prefill?.sellToken
        ? JSON.stringify(options.prefill, null, 2)
        : undefined,
    currency:
      options.currency !== "USD" && options.currency
        ? quotes(options.currency)
        : undefined,
    showThirdwebBranding:
      options.showThirdwebBranding === false ? false : undefined,
    client: "client",
  };

  return `\
${stringifyImports(imports)}

const client = createThirdwebClient({
  clientId: "....",
});

function Example() {
  return (
    <SwapWidget ${stringifyProps(props)} />
  );
}`;
}
