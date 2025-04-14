import { CodeExample } from "../code/code-example";
import {
  TokenImageBasicPreview,
  TokenImageOverridePreview,
  TokenNameBasicPreview,
  TokenSymbolBasicPreview,
} from "./token-previews";

export function TokenImageBasic() {
  return (
    <div>
      <CodeExample
        header={{
          title: "TokenIcon",
          description: "Show the default native icon of a network",
        }}
        preview={<TokenImageBasicPreview />}
        code={`import { TokenProvider, TokenIcon } from "thirdweb/react";

function App() {
  return (
    <TokenProvider
      address={NATIVE_TOKEN_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenIcon className="h-auto w-20 rounded-full" />
    </TokenProvider>
  )
}`}
        lang="tsx"
      />
      <p className="my-4 text-muted-foreground text-sm">
        Override the {`token's`} icon using the iconResolver prop.
      </p>

      <CodeExample
        preview={<TokenImageOverridePreview />}
        code={`\
import { TokenProvider, TokenIcon } from "thirdweb/react";

function App() {
  const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenIcon
        className="h-auto w-20 rounded-full"
        iconResolver="/usdc.svg"
      />
    </TokenProvider>
  )
}`}
        lang="tsx"
      />
    </div>
  );
}

export function TokenNameBasic() {
  return (
    <CodeExample
      header={{
        title: "TokenName",
        description: "Show the name of the token",
      }}
      preview={<TokenNameBasicPreview />}
      code={`import { TokenProvider, TokenName } from "thirdweb/react";

function App() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenName loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  )
}`}
      lang="tsx"
    />
  );
}

export function TokenSymbolBasic() {
  return (
    <CodeExample
      header={{
        title: "TokenSymbol",
        description: "Show the symbol of the token",
      }}
      preview={<TokenSymbolBasicPreview />}
      code={`import { TokenProvider, TokenSymbol } from "thirdweb/react";

function App() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <TokenSymbol loadingComponent={<span>Loading...</span>} />
    </TokenProvider>
  )
}`}
      lang="tsx"
    />
  );
}
