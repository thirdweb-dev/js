import { CodeExample } from "../code/code-example";
import {
  NftCardDemoPreview,
  NftDescriptionBasicPreview,
  NftMediaBasicPreview,
  NftMediaOverridePreview,
  NftNameBasicPreview,
} from "./nft-previews";

export function NftMediaExample() {
  return (
    <div>
      <CodeExample
        code={`import { NFTProvider, NFTMedia } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTMedia className="rounded-md w-40 h-40" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
        header={{
          description: "Show the media of an NFT in a collection.",
          title: "NFTMedia",
        }}
        lang="tsx"
        preview={<NftMediaBasicPreview />}
      />

      <p className="my-4 text-muted-foreground">
        Override the NFT media using the mediaResolver prop. This is useful when
        you already have the media src and want to skip the network requests on
        the client.
      </p>

      <CodeExample
        code={`import { NFTProvider, NFTMedia } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
      <NFTMedia
        className="h-40 w-40 rounded-md"
        mediaResolver={{
          src: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/1.mp4",
          poster: "ipfs://QmeGCqV1mSHTZrvuFzW1XZdCRRGXB6AmSotTqHoxA2xfDo/0.png",
        }}
      />
    </NFTProvider>
}`}
        lang="tsx"
        preview={<NftMediaOverridePreview />}
      />
    </div>
  );
}

export function NftNameExample() {
  return (
    <CodeExample
      code={`import { NFTProvider, NFTName } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTName loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
      header={{
        description: "Show the name of an NFT in a collection.",
        title: "NFTName",
      }}
      lang="tsx"
      preview={<NftNameBasicPreview />}
    />
  );
}

export function NftDescriptionBasic() {
  return (
    <CodeExample
      code={`import { NFTProvider, NFTDescription } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTDescription className="text-center" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
      header={{
        description: "Show the description of an NFT in a collection.",
        title: "NFTDescription",
      }}
      lang="tsx"
      preview={<NftDescriptionBasicPreview />}
    />
  );
}

export function NftCardExample() {
  return (
    <CodeExample
      code={`import { NFTProvider, NFTDescription, NFTName, NFTMedia } from "thirdweb/react";

function App() {
  return (
      <NFTProvider tokenId={0n} contract={nftContract}>
      <div className="flex w-[230px] flex-col gap-3 rounded-lg border bg-zinc-900 px-1 py-3">
        <NFTMedia className="rounded-md px-2 text-center" />
        <NFTName className="px-2 font-bold" />
        <NFTDescription
          className="px-2 text-sm"
          loadingComponent={<span>Loading...</span>}
        />
      </div>
    </NFTProvider>
  )
}`}
      header={{
        description:
          "Using these headless components, you can easily build your own NFT Card",
        title: "Build an NFT Card",
      }}
      lang="tsx"
      preview={<NftCardDemoPreview />}
    />
  );
}
