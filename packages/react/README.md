<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/typescript-sdk/blob/main/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb React SDK</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/react"><img src="https://img.shields.io/github/package-json/v/thirdweb-dev/react?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/react/actions"><img alt="Build Status" src="https://github.com/thirdweb-dev/react/actions/workflows/build.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Ultimate collection of React hooks for your web3 apps</strong></p>
<br />

## Installation

You can install this SDK with either `npm` or `yarn`:

```sh
npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

```sh
yarn add @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

## Starter Templates

We provide template repositories that already have the thirdweb React SDK setup and ready-to-go to help you get started with thirdweb quickly. You can find all the available starter respositories below.

- Next.js ([typescript](https://github.com/thirdweb-example/next-typescript-starter) / [javascript](https://github.com/thirdweb-example/next-javascript-starter))
- Create React App ([typescript](https://github.com/thirdweb-example/cra-typescript-starter) / [javascript](https://github.com/thirdweb-example/cra-javascript-starter))
- Vite ([typescript](https://github.com/thirdweb-example/vite-typescript-starter) / [javascript](https://github.com/thirdweb-example/vite-javascript-starter))

## Quick Start

**Configure the thirdweb Provider**

In order to use the hooks offered by the React SDK, you need to first setup a `ThirdwebProvider` for your app which lets you optionally configure your app. You can use this configuration to control what networks you want users to connect to, what types of wallets can connect to your app, and the settings for the [Typescript SDK](https://docs.thirdweb.com/typescript).

At the top level of your application, add a `ThirdwebProvider` as follows:

```jsx title="App.jsx"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

const App = () => {
  return (
    <ThirdwebProvider desiredChainId={ChainId.Mainnet}>
      <YourApp />
    </ThirdwebProvider>
  );
};
```

Now you'll be able to use all the hooks provided by the React SDK! Let's take a look.

**Let Users Connect Wallets**

Next, we'll add a button to our app which will let users connect their wallets. For now, we'll make it so that users with MetaMask wallets can connect.

```jsx title="ConnectMetamaskButton.jsx"
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

export const ConnectMetamaskButtonComponent = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  return (
    <div>
      {address ? (
        <h4>Connected as {address}</h4>
      ) : (
        <button onClick={connectWithMetamask}>Connect Metamask Wallet</button>
      )}
    </div>
  );
};
```

Here, we use the `useMetamask` hook to handle metamask connection. When a user clicks the button, we'll call the `connectWithMetamask` function, which will prompt users to connect their metamask wallet.

**Interact With Contracts**

The thirdweb React SDK also enables you to interact directly with contracts through simple hooks!

Let's setup a simple component to interact with an NFT Collection contract and get the data of all the NFTs on the contract.

```jsx title="NFTList.jsx"
import { useMintNFT, useNFTCollection, useNFTs } from "@thirdweb-dev/react";

const NFTListComponent = () => {
  const address = useAddress();
  const nftCollection = useNFTCollection("<NFT-COLLECTION-CONTRACT-ADDRESS>");
  const { data: nfts } = useNFTs(nftCollection);
  const { mutate: mintNFT } = useMintNFT(nftCollection);

  const mint = () => {
    mintNFT({
      to: address,
      metadata: {
        name: "Cool NFT",
        description: "Minted from react",
      },
    });
  };

  return (
    <div>
      <button onClick={mint}>Mint</button>
      <ul>
        {nfts?.map((nft) => (
          <li key={nft.metadata.id.toString()}>{nft.metadata.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

Here, we get an `NFT Collection` contract instance from the [TypeScript SDK](https://docs.thirdweb.com/typescript). We can then use all the methods on this thirdweb contract SDK instance - here we use the `mintTo` method to mint an NFT on the contract, and we use `useNFTList` to display all the NFTs in the collection on the page.

And that's all for the setup! Just like that, you can setup a `ThirdwebProvider` and use all the hooks of the SDK, allowing you to let users connect wallets, interact with contracts, and more!

## Advanced Configuration

The `ThirdwebProvider` offers a number of configuration options to control the behavior of the React and Typescript SDK.

These all the configuration options of the `<ThirdwebProvider />`.
We provide defaults for all of these, but you customize them to suit your needs.

```jsx title="App.jsx"
import { ChainId, IpfsStorage, ThirdwebProvider } from "@thirdweb-dev/react";

const KitchenSinkExample = () => {
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Mainnet}
      chainRpc={{ [ChainId.Mainnet]: "https://mainnet.infura.io/v3" }}
      dAppMeta={{
        name: "Example App",
        description: "This is an example app",
        isDarkMode: false,
        logoUrl: "https://example.com/logo.png",
        url: "https://example.com",
      }}
      storageInterface={new IpfsStorage("https://your.ipfs.host.com")}
      supportedChains={[ChainId.Mainnet]}
      walletConnectors={[
        "walletConnect",
        { name: "injected", options: { shimDisconnect: false } },
        {
          name: "walletLink",
          options: {
            appName: "Example App",
          },
        },
        {
          name: "magic",
          options: {
            apiKey: "your-magic-api-key",
            rpcUrls: {
              [ChainId.Mainnet]: "https://mainnet.infura.io/v3",
            },
          },
        },
      ]}
      sdkOptions={{
        gasSettings: { maxPriceInGwei: 500, speed: "fast" },
        readonlySettings: {
          chainId: ChainId.Mainnet,
          rpcUrl: "https://mainnet.infura.io/v3",
        },
        gasless: {
          openzeppelin: {
            relayerUrl: "your-relayer-url",
          },
        },
      }}
    >
      <YourApp />
    </ThirdwebProvider>
  );
};
```
