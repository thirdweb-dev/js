<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb React SDK</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/react"><img src="https://img.shields.io/npm/v/@thirdweb-dev/react?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Ultimate collection of React hooks for your web3 apps</strong></p>
<br />

<br />

## Installation

The easiest way to get started with the React SDK is to use the CLI:

```sh
npx thirdweb create --app
```

Alternatively, you can install the SDK into your existing project using npm or yarn:

```sh
npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

```sh
yarn add @thirdweb-dev/react @thirdweb-dev/sdk ethers
```

<br />

## Getting Started

Our SDK uses a [Provider Pattern](https://flexiple.com/react/provider-pattern-with-react-context-api/); meaning any component within the `ThirdwebProvider` will have access to the SDK. If you use the CLI to initialize your project, this is already set up for you.

Let's take a look at a typical setup:

<br />

### Configure the `ThirdwebProvider`

Specify the network your smart contracts are deployed to in the `desiredChainId` prop and wrap your application like so:

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

Below are examples of where to set this up in your application:

<p>
  <a href="https://github.com/thirdweb-example/cra-javascript-starter/blob/main/src/index.js">Create React App</a> •
  <a href="https://github.com/thirdweb-example/next-javascript-starter/blob/main/pages/_app.js">Next.js</a> •
  <a href="https://github.com/thirdweb-example/vite-javascript-starter/blob/main/src/main.jsx">Vite</a>
</p>

<br />

### Connect to a User's Wallet

Now the provider is set up, we can use all of the hooks and UI components available in the SDK, such as the [ConnectWallet](https://portal.thirdweb.com/ui-components/connectwalletbutton) component.

Once the user has connected their wallet, all the calls we make to interact with contracts using the SDK will be on behalf of the user.

```jsx title="ConnectMetamaskButton.jsx"
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export const YourApp = () => {
  const address = useAddress();
  return (
    <div>
      <ConnectWallet />
    </div>
  );
};
```

The `ConnectWallet` component handles everything for us, including switching networks, accounts, displaying balances and more.

We can then get the connected address using the `useAddress` hook anywhere in the app.

<br/>

### Interact With Contracts

Connect to your smart contract using the [`useContract`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/getting-a-contract#connect-to-a-contract)
hook like so:

```jsx title="pages/index.jsx"
import { useContract } from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");

  // Now you can use the contract in the rest of the component!
}
```

You can then use [`useContractRead`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/using-contracts) and [`useContractWrite`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/using-contracts) to read data and write transactions to the contract.

You pass the `contract` object returned from `useContract` to these hooks as the first parameter and the name of the function (or view/mapping, etc.) on your smart contract as the second parameter. If your function requires parameters, you can pass them as additional arguments.

For example, we can read the `name` of our contract like so:

```jsx title="pages/index.jsx"
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: name, isLoading: loadingName } = useContractRead(
    contract,
    "name", // The name of the view/mapping/variable on your contract
  );
  const { mutate: setName, isLoading: settingName } = useContractWrite(
    contract,
    "setName", // The name of the function on your contract
  );
}
```

<br />

### Using Extensions

Each [extension](https://portal.thirdweb.com/extensions) you implement in your smart contract unlocks new functionality in the SDK.

These hooks make it easy to interact with your smart contracts by implementing the complex logic for you under the hood.

For example, if your smart contract implements [ERC721Supply](https://portal.thirdweb.com/contractkit/interfaces/erc721supply#unlocked-features), you unlock the ability to [view all NFTs](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721supply#get-all-minted-nfts) on that contract using the SDK; which fetches all of your NFT metadata and the current owner of each NFT in parallel. In the React SDK, that is available using `useNFTs`:

```jsx
import { useContract, useNFTs } from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
}
```

If we want to mint an NFT and our contract implements [ERC721Mintable](https://portal.thirdweb.com/contractkit/interfaces/erc721mintable#unlocked-features), we can use the [`useMintNFT`](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721mintable) hook to mint an NFT from the connected wallet; handling all of the logic of uploading and pinning the metadata to IPFS for us behind the scenes.

```jsx
import { useContract, useNFTs, useMintNFT } from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
  const { mutate: mintNFT, isLoading: isMintingNFT } = useMintNFT(contract);
}
```

<br />

### UI Components

The SDK provides many UI components to help you build your application.

For example, we can render each of the NFTs using the [`NFT Media Renderer`](https://portal.thirdweb.com/ui-components/nft-renderer)
component, making use of the loading state from `useNFTs`:

```jsx title="pages/index.jsx"
import { useContract, useNFTs, ThirdwebNftMedia } from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);

  return (
    <div>
      <h2>My NFTs</h2>
      {isReadingNfts ? (
        <p>Loading...</p>
      ) : (
        <div>
          {nfts.map((nft) => (
            <ThirdwebNftMedia
              key={nft.metadata.id}
              metadata={nft.metadata}
              height={200}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

The [`Web3Button`](https://portal.thirdweb.com/ui-components/web3button) component ensures the user has connected their wallet and is currently configured to the same network as your smart contract before calling the function. It also has access to the `contract` directly, allowing you to perform any action on your smart contract when the button is clicked.

For example, we can mint an NFT like so:

```jsx title="pages/index.jsx"
import {
  useContract,
  useNFTs,
  ThirdwebNftMedia,
  Web3Button,
} from "@thirdweb-dev/react";

const contractAddress = "<CONTRACT_ADDRESS>";
export default function Home() {
  const { contract } = useContract(contractAddress);
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);

  return (
    <div>
      {/* ... Existing Display Logic here ... */}

      <Web3Button
        contractAddress={contractAddress}
        action={(contract) =>
          contract.erc721.mint({
            name: "Hello world!",
            image:
              // You can use a file or URL here!
              "ipfs://QmZbovNXznTHpYn2oqgCFQYP4ZCpKDquenv5rFCX8irseo/0.png",
          })
        }
      >
        Mint NFT
      </Web3Button>
    </div>
  );
}
```

<br />

## Advanced Configuration

The `ThirdwebProvider` offers a number of configuration options to control the behavior of the React and Typescript SDK.

These are all the configuration options of the `<ThirdwebProvider />`.
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
