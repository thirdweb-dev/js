"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { NATIVE_TOKEN_ADDRESS } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import {
  TokenIcon,
  TokenName,
  TokenProvider,
  TokenSymbol,
} from "thirdweb/react";
import { CodeExample } from "../code/code-example";

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

export function TokenImageBasic() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          TokenIcon
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the default native icon of a network
        </p>
      </div>

      <CodeExample
        preview={
          <TokenProvider
            address={NATIVE_TOKEN_ADDRESS}
            client={THIRDWEB_CLIENT}
            chain={ethereum}
          >
            <TokenIcon className="h-auto w-20 rounded-full" />
          </TokenProvider>
        }
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
    </>
  );
}

export function TokenImageOverride() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h4 className="font-semibold text-lg">
          Override the token&apos;s icon using the <b>iconResolver</b> prop.
        </h4>
        <p className="max-w-[600px] text-lg">
          There is no official way to query the icon of a token. If you have a
          source, you can pass it to the iconResolver prop.
        </p>
      </div>

      <CodeExample
        preview={
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
        }
        code={`import { TokenProvider, TokenIcon } from "thirdweb/react";

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
    </>
  );
}

export function TokenNameBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          TokenName
        </h2>
        <p className="max-w-[600px] text-lg">Show the name of the token</p>
      </div>

      <CodeExample
        preview={
          <TokenProvider
            address={USDC_ADDRESS}
            client={THIRDWEB_CLIENT}
            chain={ethereum}
          >
            <TokenName loadingComponent={<span>Loading...</span>} />
          </TokenProvider>
        }
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
    </>
  );
}

export function TokenSymbolBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          TokenSymbol
        </h2>
        <p className="max-w-[600px] text-lg">Show the symbol of the token</p>
      </div>

      <CodeExample
        preview={
          <TokenProvider
            address={USDC_ADDRESS}
            client={THIRDWEB_CLIENT}
            chain={ethereum}
          >
            <TokenSymbol loadingComponent={<span>Loading...</span>} />
          </TokenProvider>
        }
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
    </>
  );
}

export function TokenCard() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Build a token card
        </h2>
        <p className="max-w-[600px] text-lg">
          You can build a Token card by putting the Token components together
        </p>
      </div>

      <CodeExample
        preview={
          <TokenProvider
            address={USDC_ADDRESS}
            client={THIRDWEB_CLIENT}
            chain={ethereum}
          >
            <div className="flex flex-row items-center gap-2 rounded-lg border bg-slate-950 px-4 py-1">
              <TokenIcon className="h-10 w-10" iconResolver="/usdc.svg" />
              <div className="flex flex-col">
                <TokenName
                  className="font-bold"
                  loadingComponent={<span>Loading...</span>}
                />
                <TokenSymbol
                  className="text-gray-500"
                  loadingComponent={<span>Loading...</span>}
                />
              </div>
            </div>
          </TokenProvider>
        }
        code={`import { TokenProvider, TokenSymbol } from "thirdweb/react";

function App() {
  return (
    <TokenProvider
      address={USDC_ADDRESS}
      client={THIRDWEB_CLIENT}
      chain={ethereum}
    >
      <div className="flex flex-row items-center gap-2 rounded-lg border bg-slate-950 px-4 py-1">
        <TokenIcon className="h-10 w-10" iconResolver="/usdc.svg" />
        <div className="flex flex-col">
          <TokenName
            className="font-bold"
          />
          <TokenSymbol
            className="text-gray-500"
          />
        </div>
      </div>
    </TokenProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}
