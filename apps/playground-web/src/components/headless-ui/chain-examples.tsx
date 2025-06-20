import { CodeExample } from "../code/code-example";
import { ChainIconPreview, ChainNamePreview } from "./chain-previews";

export function ChainIconExample() {
  return (
    <CodeExample
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
      header={{
        description: "Show the native icon of a network",
        title: "ChainIcon",
      }}
      lang="tsx"
      preview={<ChainIconPreview />}
    />
  );
}

export function ChainNameExample() {
  return (
    <CodeExample
      code={`import { ChainProvider, ChainName } from "thirdweb/react";

function App() {
  return (
    <ChainProvider chain={avalanche}>
      <ChainName loadingComponent={<span>Loading...</span>} />
    </ChainProvider>
  )
}`}
      header={{
        description: "Show the name of the chain",
        title: "ChainName",
      }}
      lang="tsx"
      preview={<ChainNamePreview />}
    />
  );
}
