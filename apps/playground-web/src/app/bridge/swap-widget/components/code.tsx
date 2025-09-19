import { lazy, Suspense } from "react";
import { LoadingDots } from "@/components/ui/LoadingDots";
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
  return (
    <div className="flex w-full grow flex-col">
      <Suspense fallback={<CodeLoading />}>
        <CodeClient className="grow" code={getCode(props.options)} lang="ts" />
      </Suspense>
    </div>
  );
}

function getCode(options: SwapWidgetPlaygroundOptions) {
  const imports = {
    react: ["SwapWidget"] as string[],
  };

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
import { createThirdwebClient } from "thirdweb";
import { ${imports.react.join(", ")} } from "thirdweb/react";

const client = createThirdwebClient({
  clientId: "....",
});


function Example() {
  return (
    <SwapWidget
      ${stringifyProps(props)}
    />
  );
}`;
}

function quotes(value: string) {
  return `"${value}"`;
}

function stringifyProps(props: Record<string, string | undefined | boolean>) {
  const _props: Record<string, string | undefined | boolean> = {};

  for (const key in props) {
    if (props[key] !== undefined && props[key] !== "") {
      _props[key] = props[key];
    }
  }

  return Object.entries(_props)
    .map(([key, value]) => `${key}={${value}}`)
    .join("\n\t  ");
}
