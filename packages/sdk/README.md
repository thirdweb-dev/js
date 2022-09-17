<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb TypeScript SDK</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/sdk"><img src="https://img.shields.io/npm/v/@thirdweb-dev/sdk?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/CI.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Best in class Web3 SDK for Browser, Node and Mobile apps</strong></p>
<br />

## Installation

Install the latest version of the SDK with `npm`:

```shell
npm install @thirdweb-dev/sdk ethers
```

or with `yarn`:

```shell
yarn add @thirdweb-dev/sdk ethers
```

## Quick start

### 1. Deploy & customize your contracts

- Using your [thirdweb dashboard](https://thirdweb.com/dashboard) (recommended)
- Using the [SDK directly](https://portal.thirdweb.com/typescript/sdk.contractdeployer)
- Using the [thirdweb CLI](https://portal.thirdweb.com/deploy)

### 2. Reading data from your contracts

The quickest way to get started is to use the SDK as read only (no transactions).
This will allow you to query data from any contract with no additional setup.

```javascript title="my_script.js"
// my_script.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// instantiate the SDK in read-only mode (our example is running on `polygon` here)
// all major chains and testnets are supported (e.g. `mainnet`, 'optimism`, 'arbitrum', 'polygon', `goerli`, 'mumbai', etc.)
const sdk = new ThirdwebSDK("polygon");

// access your deployed contracts
const contract = await sdk.getContract("0x...");

// Read data using direct calls to your contract
const myData = await contract.call("myFunction");

// Or Using the extensions API matching to your contract extensions
const allNFTs = await contract.erc721.getAll();
const tokenSupply = await contract.erc20.totalSupply();
```

You can execute this code as a node script by executing:

```shell
node my_script.js
```

Note that you can also access any deployed contract using its ABI, using `sdk.getContractFromAbi(address, abi)` and get the same functionality. For contracts deployed via thirdweb, we handle the ABI for you.

### 3. Executing transactions on your contracts

In order to execute transactions on your contract, the SDK needs to know which wallet is executing those transactions.
This can be done two ways:

- Using your own private key (typically used in the backend or scripts)
- By connecting to a user wallet (typically used in the frontend)

#### 3.1 Backend / Scripting usage

Here's how to provide your own private key to the SDK to perform transactions with your account from scripts or from a node.js backend:

```javascript title="my_script.js"
// my_script.js
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Learn more about securely accessing your private key: https://portal.thirdweb.com/web3-sdk/set-up-the-sdk/securing-your-private-key
const privateKey = "<your-private-key-here>";
// instantiate the SDK based on your private key, with the desired chain to connect to
const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "polygon");

// deploy existing contracts, or your own using the thirdweb CLI
const deployedAddress = sdk.deployer.deployNFTCollection({
  name: "My NFT Collection",
  primary_sale_recipient: "0x...",
});

// access your deployed contracts
const contract = await sdk.getContract(deployedAddress);

// Execute any of your functions on your contracts from the connected wallet
await contract.call("myFunction", arg1, arg2);

// Or execute transactions using the extensions API
await contract.erc721.mint({
  name: "Cool NFT",
  description: "Minted NFT from code!",
  image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
});
```

You can execute this code as a node script by executing:

```shell
node my_script.js
```

#### 3.2 Frontend usage

For frontend applications, head over to our [React Github repo](https://github.com/thirdweb-dev/js/tree/main/packages/react) which shows you how to connect to a user's wallet like Metamask, and automatically instantiate the thirdweb SDK for you.

Easiest way to get started on the frontend is using one of our templates in the [thirdweb examples repo](https://github.com/thirdweb-example).

## API Reference & code examples

- [Step by step guides and recipes](https://portal.thirdweb.com)
- [Full Api Reference and code examples](https://docs.thirdweb.com/typescript)

## Build from source

To build the project:

```shell
yarn install
yarn build
```

After building, to run the tests (requires a local hardhat node running):

```shell
yarn test:all
```

OR

If you have make and docker installed you can simply run

```shell
make test
```

## Get in touch

- [Discord](https://discord.gg/thirdweb)
- [Twitter](https://twitter.com/thirdweb_/)
