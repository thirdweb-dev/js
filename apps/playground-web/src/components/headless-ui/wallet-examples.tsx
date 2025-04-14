import { CodeExample } from "../code/code-example";
import {
  WalletIconBasicPreview,
  WalletNameBasicPreview,
  WalletNameFormatPreview,
} from "./wallet-previews";

export function WalletIconExample() {
  return (
    <CodeExample
      header={{
        title: "WalletIcon",
        description: "Show the icon of a crypto wallet",
      }}
      preview={<WalletIconBasicPreview />}
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
  );
}

export function WalletNameExample() {
  return (
    <div>
      <CodeExample
        header={{
          title: "WalletName",
          description: "Show the name of a crypto wallet",
        }}
        preview={<WalletNameBasicPreview />}
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

      <p className="my-4 text-muted-foreground text-sm">
        Transform the wallet name using the formatFn prop.
      </p>

      <CodeExample
        preview={<WalletNameFormatPreview />}
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
    </div>
  );
}
