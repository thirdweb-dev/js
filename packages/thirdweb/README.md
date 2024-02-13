<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb</h1>
<p align="center">
<a href="https://www.npmjs.com/package/thirdweb"><img src="https://img.shields.io/npm/v/thirdweb?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

## Installation

```bash
npm install thirdweb@alpha
```

## High Level Concepts

### Clients

A client is the entry point to the thirdweb SDK. It is required for all other actions.

```ts
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  // one of these is required to initialize a client - create a free api key at https://thirdweb.com/dashboard
  secretKey: "<you secret key>",
  // or
  clientId: "<your client id>",
});
```

### Contract

A "contract" is a wrapper around a smart contract that is deployed on a chain. It is what you use to create [transactions](#transactions) and [read contract state](#read---reading-contract-state).

```ts
import { createThirdwebClient, getContract } from "thirdweb";

const client = createThirdwebClient({...})
const contract = getContract({
  // pass in the client
  client,
  // pass the contract address
  address: "0x123...",
  // and the chainId
  chainId: 5,
  // OPTIONALLY the contract's abi
  abi: [...],
})
```

### Transactions

Transactions are the primary way to interact with smart contracts. They are created using the `transaction` function.

There are 4 ways to create a transaction, all of these return the same transaction object.

##### Method Signature

```ts
import { prepareContractCall } from "thirdweb";

const tx = prepareContractCall({
  contract,
  // pass the method signature that you want to call
  method: "function mintTo(address to, uint256 amount)",
  // and the params for that method
  // their types are automatically inferred based on the method signature
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### Automatic ABI Resolution

```ts
import { prepareContractCall } from "thirdweb";
const tx = prepareContractCall({
  contract,
  // in this case we only pass the name of the method we want to call
  method: "mintTo",
  // however using this method we lose type safety for our params
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### Explicit Contract ABI

```ts
import { getContract, prepareContractCall } from "thirdweb";

const contract = getContract({
  {...}
  // the abi for the contract is defined here
  abi: [
    ...
    {
      name: "mintTo",
      inputs: [
        {
          type: "address",
          name: "to",
        },
        {
          type: "uint256",
          name: "amount",
        },
      ],
      type: "function",
    }
    ...
  ],
});

const tx = prepareContractCall({
  contract,
  // we get auto-completion for all the available functions on the contract ABI
  method: "mintTo",
  // including full type-safety for the params
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### ABI Snippet

```ts
import { prepareContractCall } from "thirdweb";
const tx = prepareContractCall({
  client,
  // in this case we pass the piece of the abi for the method we want to call
  abi: {
    name: "mintTo",
    inputs: [
      {
        type: "address",
        name: "to",
      },
      {
        type: "uint256",
        name: "amount",
      },
    ],
    type: "function",
  },
  // types are automatically inferred based on the ABI inputs
  params: ["0x123...", 100n * 10n ** 18n],
});
```

#### Actions

Transactions have a variety of actions that can be called on them, in all cases this is done by calling the action on the transaction object itself.

##### `read` - reading contract state

For reading contract state, there is a shortcut function called `read` that can be used instead of `prepareContractCall`:

```ts
import { readContract } from "thirdweb";

// output type is automatically inferred based on the method signature
const balance = await readContract({
  //    ^ bigint
  contract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x123..."],
});
```

Which is the equivalent of doing:

```ts
import { prepareContractCall, readTransaction } from "thirdweb";

const tx = prepareContractCall({
  contract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x123..."],
});

const balance = await readTransaction(tx);
```

##### `estimateGas` - estimating gas cost for a tx

```ts
import { estimateGas } from "thirdweb";

const gasEstimate = await estimateGas(tx);
```

##### `sendTransaction` - sending a transaction

See [Wallets](#wallets) for more information on how to send a transaction.

```ts
import { sendTransaction } from "thirdweb";
import { privateKeyWallet } from "thirdweb/wallets/private-key";

const wallet = privateKeyWallet({ privateKey: "<your private key>" });

const { transactionHash } = sendTransaction(tx, wallet);
```

##### `waitForReceipt` - waiting for a transaction to be mined

```ts
import { waitForReceipt } from "thirdweb";

const receipt = await waitForReceipt({
  contract,
  transactionHash: "0x...",
});
```

### Wallets

_TODO: add more info._

Currently available:

#### Metamask

For usage in browsers.

```ts
import { metamaskWallet } from "thirdweb/wallets/metamask";

const wallet = await metamaskWallet();
```

#### Private Key

For usage in backend environments.

```ts
import { privateKeyWallet } from "thirdweb/wallets/private-key";

const wallet = privateKeyWallet({ client, privateKey: "<your private key>" });
```

### Extensions

_**Alpha Note**: Currently some extensions are available for ERC20 and ERC721 standards, we are constantly adding more._

Extensions are "pre-compiled" [transactions](#transactions) for common actions. Their API is generally same as for transactions / reading contract state.

They are namespaced by ERC standard, meaning you can import them like this:

```ts
// import the `balanceOf` and `mintTo` extensions for the ERC20 standard
import { balanceOf, mintTo } from "thirdweb/extensions/erc20";
```

## Examples

### Backend (Node, Bun, Deno, etc)

#### With Extensions

```ts
import {
  createThirdwebClient,
  getContract,
  sendTransaction,
  waitForReceipt,
} from "thirdweb";
import { privateKeyWallet } from "thirdweb/wallets/private-key";
import { balanceOf, mintTo } from "thirdweb/extensions/erc20";

// Step 1: create a client
const client = createThirdwebClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const contract = getContract({
  client,
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await balanceOf({
  contract,
  address: "0x0890C23024089675D072E984f28A93bb391a35Ab",
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = privateKeyWallet({
  client,
  privateKey: process.env.PRIVATE_KEY as string,
});

// Step 5: create a transaction
const tx = mintTo({
  contract,
  to: "0x0890C23024089675D072E984f28A93bb391a35Ab",
  amount: 100,
});

// Step 6: execute the transaction with the wallet
const transactionHash = await sendTransaction(tx, wallet);

console.log("tx hash", transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await waitForReceipt({
  transactionHash,
  contract,
});

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await balanceOf({
  contract,
  address: "0x0890C23024089675D072E984f28A93bb391a35Ab",
});

console.log("ending balance", newBalance);
```

#### Without Extensions

```ts
import {
  createThirdwebClient,
  getContract,
  readContract,
  sendTransaction,
  prepareContractCall,
  waitForReceipt,
} from "thirdweb";
import { privateKeyWallet } from "thirdweb/wallets/private-key";

// Step 1: create a client
const client = createThirdwebClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const contract = getContract({
  client,
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await readContract({
  contract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = privateKeyWallet({
  client,
  privateKey: process.env.PRIVATE_KEY as string,
});

// Step 5: create a transaction
const tx = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab", 100n * 10n ** 18n],
});

// Step 6: execute the transaction with the wallet
const transactionHash = await sendTransaction(tx, wallet);

console.log("tx hash", transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await waitForReceipt({
  contract,
  transactionHash,
});

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await readContract({
  contract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("ending balance", newBalance);
```
