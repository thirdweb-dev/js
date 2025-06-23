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
        header={{
          description: "Show the default native icon of a network",
          title: "TokenIcon",
        }}
        lang="tsx"
        preview={<TokenImageBasicPreview />}
      />
      <p className="my-4 text-muted-foreground text-sm">
        Override the {`token's`} icon using the iconResolver prop.
      </p>

      <CodeExample
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
        preview={<TokenImageOverridePreview />}
      />
    </div>
  );
}

export function TokenNameBasic() {
  return (
    <CodeExample
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
      header={{
        description: "Show the name of the token",
        title: "TokenName",
      }}
      lang="tsx"
      preview={<TokenNameBasicPreview />}
    />
  );
}

export function TokenSymbolBasic() {
  return (
    <CodeExample
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
      header={{
        description: "Show the symbol of the token",
        title: "TokenSymbol",
      }}
      lang="tsx"
      preview={<TokenSymbolBasicPreview />}
    />
  );
}
