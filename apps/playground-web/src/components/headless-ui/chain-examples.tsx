import { CodeExample } from "../code/code-example";
import { ChainIconPreview, ChainNamePreview } from "./chain-previews";

export function ChainIconExample() {
  return (
    <CodeExample
      header={{
        title: "ChainIcon",
        description: "Show the native icon of a network",
      }}
      preview={<ChainIconPreview />}
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
  );
}

export function ChainNameExample() {
  return (
    <CodeExample
      header={{
        title: "ChainName",
        description: "Show the name of the chain",
      }}
      preview={<ChainNamePreview />}
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
  );
}
