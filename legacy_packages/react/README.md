<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb React SDK</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/react"><img src="https://img.shields.io/npm/v/@thirdweb-dev/react?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
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
npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers@5
```

```sh
yarn add @thirdweb-dev/react @thirdweb-dev/sdk ethers@5
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

For example, if your smart contract implements [ERC721Supply](https://portal.thirdweb.com/solidity/extensions/erc721supply), you unlock the ability to [view all NFTs](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721supply#get-all-minted-nfts) on that contract using the SDK; which fetches all of your NFT metadata and the current owner of each NFT in parallel. In the React SDK, that is available using `useNFTs`:

```jsx
import { useContract, useNFTs } from "@thirdweb-dev/react";

export default function Home() {
  const { contract } = useContract("<CONTRACT_ADDRESS>");
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);
}
```

If we want to mint an NFT and our contract implements [ERC721Mintable](https://portal.thirdweb.com/solidity/extensions/erc721mintable), we can use the [`useMintNFT`](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721mintable) hook to mint an NFT from the connected wallet; handling all of the logic of uploading and pinning the metadata to IPFS for us behind the scenes.

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

## Available hooks

### Main hooks

| Hook                                                                                 | Description                                                                |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [`useSDK`](https://portal.thirdweb.com/react/react.usesdk)                           | Access the instance of the thirdweb SDK created by the ThirdwebProvider.   |
| [`useContract`](https://portal.thirdweb.com/react/react.usecontract)                 | Use this resolve a contract address to a smart contract instance.          |
| [`useContractWrite`](https://portal.thirdweb.com/react/react.usecontractwrite)       | Use this to get data from a contract read-function call.                   |
| [`useContractRead`](https://portal.thirdweb.com/react/react.usecontractread)         | Use this to get a function to make a write call to your contract.          |
| [`useContractEvents`](https://portal.thirdweb.com/react/react.usecontractevents)     | Use this to get the contract metadata for a (built-in or custom) contract. |
| [`useContractMetadata`](https://portal.thirdweb.com/react/react.usecontractmetadata) | Use this to get the contract metadata for a (built-in or custom) contract. |

### Wallet connection

| Hook                                                                             | Description                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`useAddress`](https://portal.thirdweb.com/react/react.useaddress)               | Hook for accessing the address of the connected wallet.     |
| [`useMetamask`](https://portal.thirdweb.com/react/react.usemetamask)             | Hook for connecting to a Metamask wallet.                   |
| [`useWalletConnect`](https://portal.thirdweb.com/react/react.usewalletconnect)   | Hook for connecting to a mobile wallet with Wallet Connect. |
| [`useCoinbaseWallet`](https://portal.thirdweb.com/react/react.usecoinbasewallet) | Hook for connecting to a Coinbase wallet.                   |
| [`useMagic`](https://portal.thirdweb.com/react/react.usemagic)                   | Hook for connecting to an email wallet using magic link.    |
| [`useGnosis`](https://portal.thirdweb.com/react/react.usegnosis)                 | Hook for connecting to a Gnosis Safe.                       |
| [`useDisconnect`](https://portal.thirdweb.com/react/react.usedisconnect)         | Hook for disconnecting the currently connected wallet.      |

### Network connection

| Hook                                                                               | Description                                                                                                                                  |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| [`useChainId`](https://portal.thirdweb.com/react/react.usechainid)                 | Hook for accessing the chain ID of the network the current wallet is connected to                                                            |
| [`useNetwork`](https://portal.thirdweb.com/react/react.usenetwork)                 | Hook for getting metadata about the network the current wallet is connected to and switching networks.                                       |
| [`useNetworkMismatch`](https://portal.thirdweb.com/react/react.usenetworkmismatch) | Hook for checking whether the connected wallet is on the correct network specified by the desiredChainId passed to the <ThirdwebProvider />. |

### NFT

| Hook                                                                                             | Description                                                                         |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [`useNFT`](https://portal.thirdweb.com/react/react.usenft)                                       | Use this to get an individual NFT token of your NFTContract.                        |
| [`useNFTs`](https://portal.thirdweb.com/react/react.usenfts)                                     | Use this to get a list of NFT tokens of your NFTContract.                           |
| [`useTotalCirculatingSupply`](https://portal.thirdweb.com/react/react.usetotalcirculatingsupply) | Use this to get a the total (minted) supply of your NFTContract.                    |
| [`useOwnedNFTs`](https://portal.thirdweb.com/react/react.useownednfts)                           | Use this to get a the owned NFTs for a specific Erc721OrErc1155 and wallet address. |
| [`useNFTBalance`](https://portal.thirdweb.com/react/react.usenftbalance)                         | Use this to get a the total balance of a NFTContract and wallet address.            |
| [`useTotalCount`](https://portal.thirdweb.com/react/react.usetotalcount)                         | Use this to get the total count of NFT tokens of your NFTContract.                  |
| [`useMintNFT`](https://portal.thirdweb.com/react/react.usemintnft)                               | Use this to mint a new NFT on your Erc721OrErc1155.                                 |
| [`useMintNFTSupply`](https://portal.thirdweb.com/react/react.usemintnftsupply)                   | Use this mint extra supply on your Erc1155.                                         |
| [`useTransferNFT`](https://portal.thirdweb.com/react/react.usetransfernft)                       | Use this to transfer tokens on your NFTContract.                                    |
| [`useAirdropNFT`](https://portal.thirdweb.com/react/react.useairdropnft)                         | Use this to airdrop tokens on your Erc1155.                                         |
| [`useBurnNFT`](https://portal.thirdweb.com/react/react.useburnnft)                               | Use this to burn an NFT on your Erc721OrErc1155.                                    |

### Token

| Hook                                                                                     | Description                                                        |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`useTokenSupply`](https://portal.thirdweb.com/react/react.usetokensupply)               | Use this to get a the total supply of your contract.               |
| [`useTokenBalance`](https://portal.thirdweb.com/react/react.usetokenbalance)             | Use this to get the balance of your contract for a given address.  |
| [`useTokenDecimals`](https://portal.thirdweb.com/react/react.usetokendecimals)           | Use this to get the decimals of your contract for a given address. |
| [`useMintToken`](https://portal.thirdweb.com/react/react.useminttoken)                   | Use this to mint new tokens on your contract.                      |
| [`useClaimToken`](https://portal.thirdweb.com/react/react.useclaimtoken)                 | Use this to claim tokens from your contract.                       |
| [`useTransferToken`](https://portal.thirdweb.com/react/react.usetransfertoken)           | Use this to transfer tokens on your contract.                      |
| [`useTransferBatchToken`](https://portal.thirdweb.com/react/react.usetransferbatchtoken) | Use this to transfer batch tokens on your contract.                |
| [`useBurnToken`](https://portal.thirdweb.com/react/react.useburntoken)                   | Use this to burn tokens on your contract.                          |

### Marketplace

| Hook                                                                                         | Description                                                                               |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [`useListing`](https://portal.thirdweb.com/react/react.uselisting)                           | Use this to get a specific listing from the marketplace.                                  |
| [`useListings`](https://portal.thirdweb.com/react/react.uselistings)                         | Use this to get a list all listings from your marketplace contract.                       |
| [`useListingsCount`](https://portal.thirdweb.com/react/react.uselistingscount)               | Use this to get a count of all listings on your marketplace contract.                     |
| [`useActiveListings`](https://portal.thirdweb.com/react/react.useactivelistings)             | Use this to get a list active listings from your marketplace contract.                    |
| [`useWinningBid`](https://portal.thirdweb.com/react/react.usewinningbid)                     | Use this to get a the winning bid for an auction listing from your marketplace contract.  |
| [`useAuctionWinner`](https://portal.thirdweb.com/react/react.useauctionwinner)               | Use this to get the winner of an auction listing from your marketplace contract.          |
| [`useBidBuffer`](https://portal.thirdweb.com/react/react.usebidbuffer)                       | Use this to get the buffer in basis points between offers from your marketplace contract. |
| [`useCreateDirectListing`](https://portal.thirdweb.com/react/react.usecreatedirectlisting)   | Use this to create a new Direct Listing on your marketplace contract.                     |
| [`useCreateAuctionListing`](https://portal.thirdweb.com/react/react.usecreateauctionlisting) | Use this to create a new Auction Listing on your marketplace contract.                    |
| [`useCancelListing`](https://portal.thirdweb.com/react/react.usecancellisting)               | Use this to cancel a listing on your marketplace contract.                                |
| [`useMakeBid`](https://portal.thirdweb.com/react/react.usemakebid)                           | Use this to place a bid on an auction listing from your marketplace contract.             |
| [`useBuyNow`](https://portal.thirdweb.com/react/react.usebuynow)                             | Use this to buy out an auction listing from your marketplace contract.                    |
| [`useBuyDirectListing`](https://portal.thirdweb.com/react/react.useBuyDirectListing)         | Use this to buy from a direct listing in your marketplace v3 contract.                    |

### Permissions Controls

| Hook                                                                                   | Description                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`useAllRoleMembers`](https://portal.thirdweb.com/react/react.useallrolemembers)       | Use this to get the roles of all members.                                       |
| [`useRoleMembers`](https://portal.thirdweb.com/react/react.userolemembers)             | Use this to get the members of a role.                                          |
| [`useIsAddressRole`](https://portal.thirdweb.com/react/react.useisaddressrole)         | Use this to check if a WalletAddress is a member of a role.                     |
| [`useSetAllRoleMembers`](https://portal.thirdweb.com/react/react.usesetallrolemembers) | Use this to OVERWRITE the list of addresses that are members of specific roles. |
| [`useGrantRole`](https://portal.thirdweb.com/react/react.usegrantrole)                 | Use this to grant a WalletAddress a specific role.                              |
| [`useRevokeRole`](https://portal.thirdweb.com/react/react.userevokerole)               | Use this to revoke a WalletAddress a specific role.                             |

### Drop

| Hook                                                                                           | Description                                                                          |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`useUnclaimedNFTs`](https://portal.thirdweb.com/react/react.useunclaimednfts)                 | Use this to get a list of unclaimed NFT tokens of your ERC721 Drop contract.         |
| [`useClaimedNFTs`](https://portal.thirdweb.com/react/react.useclaimednfts)                     | Use this to get a list of claimed (minted) NFT tokens of your ERC721 Drop contract.. |
| [`useUnclaimedNFTSupply`](https://portal.thirdweb.com/react/react.useunclaimednftsupply)       | Use this to get the total unclaimed NFT supply of your ERC721 Drop contract.         |
| [`useClaimedNFTSupply`](https://portal.thirdweb.com/react/react.useclaimednftsupply)           | Use this to get the total claimed (minted) NFT supply of your ERC721 Drop contract.  |
| [`useBatchesToReveal`](https://portal.thirdweb.com/react/react.usebatchestoreveal)             | Use this to get a list of batches that are ready to be revealed.                     |
| [`useClaimNFT`](https://portal.thirdweb.com/react/react.useclaimnft)                           | Use this to claim a NFT on your DropContract                                         |
| [`useLazyMint`](https://portal.thirdweb.com/react/react.uselazymint)                           | Use this to lazy mint a batch of NFTs on your DropContract.                          |
| [`useDelayedRevealLazyMint`](https://portal.thirdweb.com/react/react.usedelayedreveallazymint) | Use this to lazy mint a batch of delayed reveal NFTs on your DropContract.           |
| [`useRevealLazyMint`](https://portal.thirdweb.com/react/react.usereveallazymint)               | Use this to reveal a batch of delayed reveal NFTs on your RevealableContract.        |

### Claim Conditions

| Hook                                                                                                   | Description                                                                                              |
| ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [`useActiveClaimCondition`](https://portal.thirdweb.com/react/react.useactiveclaimcondition)           | Use this to get the active claim condition for ERC20, ERC721 or ERC1155 based contracts.                 |
| [`useClaimConditions`](https://portal.thirdweb.com/react/react.useclaimconditions)                     | Use this to get all claim conditions for ERC20, ERC721 or ERC1155 based contracts.                       |
| [`useClaimIneligibilityReasons`](https://portal.thirdweb.com/react/react.useclaimineligibilityreasons) | Use this to check for reasons that prevent claiming for either ERC20, ERC721 or ERC1155 based contracts. |
| [`useSetClaimConditions`](https://portal.thirdweb.com/react/react.usesetclaimconditions)               | Use this to set claim conditions on your DropContract.                                                   |
| [`useResetClaimConditions`](https://portal.thirdweb.com/react/react.useresetclaimconditions)           | Use this to reset claim conditions on your DropContract.                                                 |
