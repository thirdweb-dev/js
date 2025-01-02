"use client";

import {
  type CodeEnvironment,
  CodeSegment,
} from "@/components/blocks/code-segment.client";
import { useState } from "react";

export function SDKSection() {
  const [codeEnvironment, setCodeEnvironment] =
    useState<CodeEnvironment>("javascript");

  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg tracking-tight">
        Integrate into your app
      </h2>

      <CodeSegment
        snippet={storageSnippets}
        environment={codeEnvironment}
        setEnvironment={setCodeEnvironment}
      />
    </div>
  );
}

const storageSnippets = {
  react: `// Check out the latest docs here: https://portal.thirdweb.com/typescript/v5/storage

import { ThirdwebProvider } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { MediaRenderer } from "thirdweb/react";

// Wrap your app in ThirdwebProvider
function Providers() {
  return (
    <ThirdwebProvider
      >
      <App />
    </ThirdwebProvider>
  );
}

function UploadFiles() {
  const uploadData = async () => {
    const uri = await upload({
      client, // thirdweb client
      files: [
        new File(["hello world"], "hello.txt"),
      ],
    });
  }

  return <div> ... </div>
}

 // Supported types: image, video, audio, 3d model, html
function ShowFiles() {
  return (
    <MediaRenderer src="ipfs://QmamvVM5kvsYjQJYs7x8LXKYGFkwtGvuRvqZsuzvpHmQq9/0" />
  );
}`,
  javascript: `// Check out the latest docs here: https://portal.thirdweb.com/typescript/v5/storage

import { upload } from "thirdweb/storage";

// Here we get the IPFS URI of where our metadata has been uploaded
const uri = await upload({
  client,
  files: [
    new File(["hello world"], "hello.txt"),
  ],
});

// This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(uri);

// Here we a URL with a gateway that we can look at in the browser
const url = await download({
  client,
  uri,
}).url;

// This will log a URL like https://ipfs.thirdwebstorage.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(url);`,

  unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Create data
NFTMetadata meta = new NFTMetadata()
{
    name = "Unity NFT",
    description = "Minted From Unity",
    image = "ipfs://QmbpciV7R5SSPb6aT9kEBAxoYoXBUsStJkMpxzymV4ZcVc",
};
string metaJson = Newtonsoft.Json.JsonConvert.SerializeObject(meta);

// Upload raw text or from a file path
var response = await ThirdwebManager.Instance.SDK.storage.UploadText(metaJson);`,
};
