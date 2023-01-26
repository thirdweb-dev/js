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

You can install the SDK into your existing project using npm or yarn:

```sh
npm install @thirdweb-dev/react-core @thirdweb-dev/sdk ethers
```

```sh
yarn add @thirdweb-dev/react-core @thirdweb-dev/sdk ethers
```

<br />

## Getting Started

Our SDK uses a [Provider Pattern](https://flexiple.com/react/provider-pattern-with-react-context-api/); meaning any component within the `ThirdwebSDKProvider` will have access to the SDK.

Let's take a look at a typical setup:

<br />

### Configure the `ThirdwebSDKProvider`

Specify the network your smart contracts are deployed to in the `desiredChainId` prop and wrap your application like so:

```jsx title="App.jsx"
import { ChainId, ThirdwebSDKProvider } from "@thirdweb-dev/react-core";

const App = () => {
  return (
    <ThirdwebSDKProvider desiredChainId={ChainId.Mainnet} provider={yourWeb3ProviderOrSigner}>
      <YourApp />
    </ThirdwebProvider>
  );
};
```

Note that you will need to provide an ethers provider or signer for you application. If you want further abstraction please
see our `react` and `react-native` SDKs which have their own providers.

Below are examples of where to set this up in your application:

<p>
  <a href="https://github.com/thirdweb-example/cra-javascript-starter/blob/main/src/index.js">Create React App</a> •
  <a href="https://github.com/thirdweb-example/next-javascript-starter/blob/main/pages/_app.js">Next.js</a> •
  <a href="https://github.com/thirdweb-example/vite-javascript-starter/blob/main/src/main.jsx">Vite</a>
</p>

<br />

### Interact With Contracts

Connect to your smart contract using the [`useContract`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/getting-a-contract#connect-to-a-contract)
hook like so:

```jsx title="pages/index.jsx"
import { useContract } from "@thirdweb-dev/react-core";

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
} from "@thirdweb-dev/react-core";

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
import { useContract, useNFTs } from "@thirdweb-dev/react-core";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
}
```

If we want to mint an NFT and our contract implements [ERC721Mintable](https://portal.thirdweb.com/contractkit/interfaces/erc721mintable#unlocked-features), we can use the [`useMintNFT`](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721mintable) hook to mint an NFT from the connected wallet; handling all of the logic of uploading and pinning the metadata to IPFS for us behind the scenes.

```jsx
import { useContract, useNFTs, useMintNFT } from "@thirdweb-dev/react-core";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
  const { mutate: mintNFT, isLoading: isMintingNFT } = useMintNFT(contract);
}
```