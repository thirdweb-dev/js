<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb Storage</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/storage"><img src="https://img.shields.io/npm/v/@thirdweb-dev/storage?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Best in class decentralized storage SDK for Browser and Node</strong></p>
<br />

## Installation

Install the latest version of the SDK with either `npm` or `yarn`:

```shell
npm install @thirdweb-dev/storage
```

```shell
yarn add @thirdweb-dev/storage
```

## Quick Start

Once you have the Thirdweb Storage SDK installed, you can use it to easily upload and download files and other data using decentralized storage systems.

Here's a simple example using the SDK to upload and download a file from IPFS:

```jsx
import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the SDK
const storage = new ThirdwebStorage();

// Now we can upload a file and get the upload URI
const file = readFileSync("path/to/file.jpg");
const uri = await storage.upload(file);

// Finally we can download the file data again
const res = await storage.download(uri);
const data = await res.text();
```

Alternatively, we can use the SDK to upload and download metadata and JSON objects, and we can also upload multiple items at once:

```jsx
// We define metadata for 2 different NFTs
const metadata = [
  {
    name: "NFT #1",
    description: "This is my first NFT",
    image: readFileSync("path/to/file.jpg"),
    properties: {
      coolness: 100,
    },
  },
  {
    name: "NFT #2",
    description: "This is my second NFT",
    image: readFileSync("path/to/file.jpg"),
    properties: {
      coolness: 200,
    },
  },
];

// And now we can upload it all at once to a single directory
const uris = await storage.uploadBatch(metadata);

// And easily retrieve the metadata
const metadata = await storage.downloadJSON(uris);
```

## Learn More

You can learn more about thirdweb and the Storage SDK with the following resources:

- [Storage Docs](https://portal.thirdweb.com/storage)
- [Thirdweb Twitter](https://twitter.com/thirdweb_)
- [Thirdweb Discord](https://discord.com/invite/thirdweb)
