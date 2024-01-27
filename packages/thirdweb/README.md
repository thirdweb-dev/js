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
import { createClient } from "thirdweb";

const client = createClient({
  // one of these is required to initialize a client - create a free api key at https://thirdweb.com/dashboard
  secretKey: "<you secret key>",
  // or
  clientId: "<your client id>",
});
```

### Contract

A "contract" is a wrapper around a smart contract that is deployed on a chain. It is what you use to create [transactions](#transactions) and [read contract state](#read---reading-contract-state).

```ts
import { createClient, contract } from "thirdweb";

const client = createClient({...})
const myContract = contract({
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
import { transaction } from "thirdweb/transaction";

const tx = transaction({
  client: myContract,
  // pass the method signature that you want to call
  method: "function mintTo(address to, uint256 amount)",
  // and the params for that method
  // their types are automatically inferred based on the method signature
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### Automatic ABI Resolution

```ts
import { transaction } from "thirdweb/transaction";
const tx = transaction({
  client: myContract,
  // in this case we only pass the name of the method we want to call
  method: "mintTo",
  // however using this method we lose type safety for our params
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### Explicit Contract ABI

```ts
import { contract } from "thirdweb";
import { transaction } from "thirdweb/transaction";

const myContract = contract({
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

const tx = transaction({
  client: myContract,
  // we get auto-completion for all the available functions on the contract ABI
  method: "mintTo",
  // including full type-safety for the params
  params: ["0x123...", 100n * 10n ** 18n],
});
```

##### ABI Snippet

```ts
import { transaction } from "thirdweb/transaction";
const tx = transaction({
  client: myContract,
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

For reading contract state, there is a shortcut function called `read` that can be used instead of `transaction`:

```ts
import { read } from "thirdweb/transaction";

// output type is automatically inferred based on the method signature
const balance = await read({
  //    ^ bigint
  client: myContract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x123..."],
});
```

Which is the equivalent of doing:

```ts
import { transaction, readTx } from "thirdweb/transaction";

const tx = transaction({
  client: myContract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x123..."],
});

const balance = await readTx(tx);
```

##### `estimateGas` - estimating gas cost for a tx

```ts
import { estimateGas } from "thirdweb/transaction";

const gasEstimate = await estimateGas(tx);
```

##### `sendTransaction` - sending a transaction

See [Wallets](#wallets) for more information on how to send a transaction.

```ts
import { privateKeyWallet } from "thirdweb/wallets/private-key";

const wallet = privateKeyWallet({ client });

const { transactionHash } = await wallet.sendTransaction(tx);
```

##### `waitForReceipt` - waiting for a transaction to be mined

```ts
import { waitForReceipt } from "thirdweb/transaction";

const receipt = await waitForReceipt(tx);
```

### Wallets

_TODO: add more info._

Currently available:

#### Metamask

For usage in browsers.

```ts
import { metamaskWallet } from "thirdweb/wallets/metamask";

const wallet = metamaskWallet({ client });

await wallet.connect();
```

#### Private Key

For usage in backend environments.

```ts
import { privateKeyWallet } from "thirdweb/wallets/private-key";

const wallet = privateKeyWallet({ client });

await wallet.connect({
  pkey: "<your private key>",
});
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
import { createClient, contract } from "thirdweb";
import { privateKeyWallet } from "thirdweb/wallets/private-key";
import { balanceOf, mintTo } from "thirdweb/extensions/erc20";
import { sendTransaction, waitForReceipt } from "thirdweb/transaction";

// Step 1: create a client
const client = createClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const myContract = contract({
  client,
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await balanceOf({
  contract: myContract,
  address: "0x0890C23024089675D072E984f28A93bb391a35Ab",
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = privateKeyWallet({ client });

await wallet.connect({ pkey: process.env.PRIVATE_KEY as string });

// Step 5: create a transaction
const tx = mintTo({
  contract: myContract,
  to: "0x0890C23024089675D072E984f28A93bb391a35Ab",
  amount: 100,
});

// Step 6: execute the transaction with the wallet
const transactionHash = await sendTransaction(tx, wallet);

console.log("tx hash", transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await waitForReceipt({
  transactionHash,
  contract: myContract,
});

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await balanceOf({
  contract: myContract,
  address: "0x0890C23024089675D072E984f28A93bb391a35Ab",
});

console.log("ending balance", newBalance);
```

#### Without Extensions

```ts
import { contract, createClient } from "thirdweb";
import {
  read,
  sendTransaction,
  transaction,
  waitForReceipt,
} from "thirdweb/transaction";
import { privateKeyWallet } from "thirdweb/wallets/private-key";

// Step 1: create a client
const client = createClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const myContract = contract({
  client,
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await read({
  contract: myContract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = privateKeyWallet({ client });

await wallet.connect({ pkey: process.env.PRIVATE_KEY as string });

// Step 5: create a transaction
const tx = transaction({
  contract: myContract,
  method: "function mintTo(address to, uint256 amount)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab", 100n * 10n ** 18n],
});

// Step 6: execute the transaction with the wallet
const transactionHash = await sendTransaction(tx, wallet);

console.log("tx hash", transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await waitForReceipt({
  contract: myContract,
  transactionHash,
});

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await read({
  contract: myContract,
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("ending balance", newBalance);
```
