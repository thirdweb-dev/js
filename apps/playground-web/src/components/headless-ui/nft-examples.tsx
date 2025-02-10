import { CodeExample } from "../code/code-example";
import {
  NftCardDemoPreview,
  NftDescriptionBasicPreview,
  NftMediaBasicPreview,
  NftMediaOverridePreview,
  NftNameBasicPreview,
} from "./nft-previews";

export function NftMediaBasic() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          NFTMedia
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the media of an NFT in a collection.
        </p>
      </div>

      <CodeExample
        preview={<NftMediaBasicPreview />}
        code={`import { NFTProvider, NFTMedia } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTMedia className="rounded-md w-40 h-40" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function NftMediaOverride() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h4 className="font-semibold text-lg">
          Override the NFT media using the <b>mediaResolver</b> prop.
        </h4>
        <p className="max-w-[600px] text-lg">
          This prop is very useful when you already have the media src and want
          to skip the network requests on the client.
        </p>
      </div>

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
    </>
  );
}

export function NftNameBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          NFTName
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the name of an NFT in a collection.
        </p>
      </div>

      <CodeExample
        preview={<NftNameBasicPreview />}
        code={`import { NFTProvider, NFTName } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTName loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function NftDescriptionBasic() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          NFTDescription
        </h2>
        <p className="max-w-[600px] text-lg">
          Show the description of an NFT in a collection.
        </p>
      </div>

      <CodeExample
        preview={<NftDescriptionBasicPreview />}
        code={`import { NFTProvider, NFTDescription } from "thirdweb/react";

function App() {
  return <NFTProvider tokenId={0n} contract={nftContract}>
    <NFTDescription className="text-center" loadingComponent={<span>Loading...</span>} />
  </NFTProvider>
}`}
        lang="tsx"
      />
    </>
  );
}

export function NftCardDemo() {
  return (
    <>
      <div className="mt-8 space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Build an NFT Card
        </h2>
        <p className="max-w-[600px] text-lg">
          Using these headless components, you can easily build your own NFT
          Card
        </p>
      </div>

      <CodeExample
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
    </>
  );
}
