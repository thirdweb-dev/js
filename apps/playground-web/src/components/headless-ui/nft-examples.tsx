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
        header={{
          title: "NFTMedia",
          description: "Show the media of an NFT in a collection.",
        }}
        preview={<NftMediaBasicPreview />}
        code={`import { NFTProvider, NFTMedia } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTMedia className="rounded-md w-40 h-40" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
        lang="tsx"
      />

      <p className="my-4 text-muted-foreground">
        Override the NFT media using the mediaResolver prop. This is useful when
        you already have the media src and want to skip the network requests on
        the client.
      </p>

      <CodeExample
        preview={<NftMediaOverridePreview />}
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
      />
    </div>
  );
}

export function NftNameExample() {
  return (
    <CodeExample
      header={{
        title: "NFTName",
        description: "Show the name of an NFT in a collection.",
      }}
      preview={<NftNameBasicPreview />}
      code={`import { NFTProvider, NFTName } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTName loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
      lang="tsx"
    />
  );
}

export function NftDescriptionBasic() {
  return (
    <CodeExample
      header={{
        title: "NFTDescription",
        description: "Show the description of an NFT in a collection.",
      }}
      preview={<NftDescriptionBasicPreview />}
      code={`import { NFTProvider, NFTDescription } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTDescription className="text-center" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
      lang="tsx"
    />
  );
}

export function NftCardExample() {
  return (
    <CodeExample
      header={{
        title: "Build an NFT Card",
        description:
          "Using these headless components, you can easily build your own NFT Card",
      }}
      preview={<NftCardDemoPreview />}
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
      lang="tsx"
    />
  );
}
