"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { avalanche } from "thirdweb/chains";
import { ChainIcon, ChainName, ChainProvider } from "thirdweb/react";
import { CodeExample } from "../code/code-example";

export function ChainIconBasic() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          ChainIcon
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the native icon of a network
        </p>
      </div>

      <CodeExample
        preview={
          <ChainProvider chain={avalanche}>
            <ChainIcon
              client={THIRDWEB_CLIENT}
              className="h-auto w-20 rounded-full"
              loadingComponent={<span>Loading...</span>}
            />
          </ChainProvider>
        }
        code={`import { ChainProvider, ChainIcon } from "thirdweb/react";

function App() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainIcon
        client={THIRDWEB_CLIENT}
        className="h-auto w-20 rounded-full"
        loadingComponent={<span>Loading...</span>}
      />
    </ChainProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}

export function ChainNameBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          ChainName
        </h2>
        <p className="max-w-[600px] text-lg">Show the name of the chain</p>
      </div>

      <CodeExample
        preview={
          <ChainProvider chain={avalanche}>
            <ChainName loadingComponent={<span>Loading...</span>} />
          </ChainProvider>
        }
        code={`import { ChainProvider, ChainName } from "thirdweb/react";

function App() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainName loadingComponent={<span>Loading...</span>} />
    </ChainProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}
