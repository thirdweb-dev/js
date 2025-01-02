"use client";

import { WalletIcon, WalletName, WalletProvider } from "thirdweb/react";
import { CodeExample } from "../code/code-example";

export function WalletIconBasic() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          WalletIcon
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the icon of a crypto wallet
        </p>
      </div>

      <CodeExample
        preview={
          <WalletProvider id="io.metamask">
            <WalletIcon
              className="h-20 w-20 rounded-full"
              loadingComponent={<span>Loading...</span>}
            />
          </WalletProvider>
        }
        code={`import { WalletProvider, WalletIcon } from "thirdweb/react";

function App() {
  return (
    <WalletProvider id="io.metamask">
      <WalletIcon
        className="h-20 w-20 rounded-full"
        loadingComponent={<span>Loading...</span>}
      />
    </WalletProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}

export function WalletNameBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          WalletName
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the name of a crypto wallet
        </p>
      </div>

      <CodeExample
        preview={
          <WalletProvider id="io.metamask">
            <WalletName loadingComponent={<span>Loading...</span>} />
          </WalletProvider>
        }
        code={`import { WalletProvider, WalletName } from "thirdweb/react";

function App() {
  return (
    <WalletProvider id="io.metamask">
      <WalletName loadingComponent={<span>Loading...</span>} />
    </WalletProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}

export function WalletNameFormat() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <p className="max-w-[600px] text-lg">
          Transform the wallet name using the <b>formatFn</b> prop.
        </p>
      </div>

      <CodeExample
        preview={
          <WalletProvider id="io.metamask">
            <WalletName formatFn={(str: string) => `${str} Wallet`} />
          </WalletProvider>
        }
        code={`import { WalletProvider, WalletName } from "thirdweb/react";

function App() {
  return (
    <WalletProvider id="io.metamask">
      <WalletName 
        loadingComponent={<span>Loading...</span>} 
        formatFn={(str: string) => \`\${str} Wallet\`}
      />
    </WalletProvider>
  )
}`}
        lang="tsx"
      />
    </>
  );
}
