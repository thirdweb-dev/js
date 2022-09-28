<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb Solana SDK</h1>
<p align="center">
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>thirdweb's Solana SDK for Browser, Node and React Native</strong></p>
<br />

## Installation

Install the latest version of the SDK with either `npm` or `yarn`:

```shell
npm install @thirdweb-dev/sdk
```

```shell
yarn add @thirdweb-dev/sdk
```

## Quick Start

The first thing to do to get started with Solana using thirdweb is to deploy a program. You can do this via the [Dashboard](https://thirdweb.com/dashboard), or via the SDK with the following snippet:

```jsx
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";

// First, we instantiate the SDK and connect to Solana devnet
const sdk = ThirdwebSDK.fromNetwork("devnet");

// Next, we pass in a keypair to the SDK (you can generate this or use your own)
// You can also generate one, using Kepair.generate() from @solana/web3.js
const keypair = Keypair.fromSecretKey(...)
sdk.wallet.connect(keypair);

// Finally, we can deploy a new NFT Collection program
const address = await sdk.deployer.createNftCollection({
  name: "My Collection",
});
```

Once we have a deployed program, we can access it using the SDK to read and write data to the program:

```jsx
// Here, we pass in the address of our deployed program
const program = await sdk.getNFTCollection(address);

// And now we can read data off our program, like getting all the NFTs from our collection
const nfts = await program.getAll();

// Or we can write data/send transactions to our program, like minting a new NFT
const mintAddress = await program.mint({
  name: "New NFT",
});
const nft = await program.get(mintAddress);
```

## Learn More

You can learn more about thirdweb and the Solana SDK with the following resources:

- [Solana Docs](https://portal.thirdweb.com/solana)
- [Thirdweb Twitter](https://twitter.com/thirdweb_)
- [Thirdweb Discord](https://discord.com/invite/thirdweb)
