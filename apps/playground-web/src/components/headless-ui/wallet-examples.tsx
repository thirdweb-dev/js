import { CodeExample } from "../code/code-example";
import {
  WalletIconBasicPreview,
  WalletNameBasicPreview,
  WalletNameFormatPreview,
} from "./wallet-previews";

export function WalletIconExample() {
  return (
    <CodeExample
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
      header={{
        description: "Show the icon of a crypto wallet",
        title: "WalletIcon",
      }}
      lang="tsx"
      preview={<WalletIconBasicPreview />}
    />
  );
}

export function WalletNameExample() {
  return (
    <div>
      <CodeExample
        code={`import { WalletProvider, WalletName } from "thirdweb/react";

function App() {
  return (
    <WalletProvider id="io.metamask">
      <WalletName loadingComponent={<span>Loading...</span>} />
    </WalletProvider>
  )
}`}
        header={{
          description: "Show the name of a crypto wallet",
          title: "WalletName",
        }}
        lang="tsx"
        preview={<WalletNameBasicPreview />}
      />

      <p className="my-4 text-muted-foreground text-sm">
        Transform the wallet name using the formatFn prop.
      </p>

      <CodeExample
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
        preview={<WalletNameFormatPreview />}
      />
    </div>
  );
}
