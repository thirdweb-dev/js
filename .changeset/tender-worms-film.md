---
"@thirdweb-dev/sdk": patch
---

### New Functions

<details>
<summary>
<code>getBlockNumber()</code> - get the latest block number for a given chain
</summary>

**Example**

Get the latest block number for Ethereum.

```js
import { getBlockNumber } from "@thirdweb-dev/sdk";

const blockNumber = await getBlockNumber({
  network: "ethereum",
});

console.log("Block number", blockNumber);
```

</details>

<details>
<summary>
<code>getBlock()</code> - get a block by number or hash
</summary>

**Example**

Get the latest block for Ethereum.

```js
import { getBlock } from "@thirdweb-dev/sdk";

const block = await getBlock({
  network: "ethereum",
  block: "latest",
});

console.log("Block", block);
```

</details>

<details>
<summary>
<code>getBlockWithTransactions()</code> - get a block (with parsed transactions) by block number or hash
</summary>

**Example**

Get the latest block for Ethereum.

```js
import { getBlockWithTransactions } from "@thirdweb-dev/sdk";

const blockWithTransactions = await getBlockWithTransactions({
  network: "ethereum",
  block: "latest",
});

console.log("Block", blockWithTransactions);
console.log("Transactions", blockWithTransactions.transactions);
```

</details>

<details>
<summary>
<code>watchBlockNumber()</code> - watch for new blocks (real-time)
</summary>

**Example**

Watch for new blocks on Ethereum.

```js
import { watchBlockNumber } from "@thirdweb-dev/sdk";

const unsubscribe = watchBlockNumber({
  network: "ethereum",
  onBlockNumber: (blockNumber) => {
    console.log("New block number", blockNumber);
  },
});

// Later unsubscribe from watching for new blocks
unsubscribe();
```

</details>

<details>
<summary>
<code>watchBlock()</code> - watch for new blocks (real-time)
</summary>

**Example**

Watch for new blocks on Ethereum.

```js
import { watchBlock } from "@thirdweb-dev/sdk";

const unsubscribe = watchBlock({
  network: "ethereum",
  onBlock: (block) => {
    console.log("New block", block);
  },
});

// Later unsubscribe from watching for new blocks
unsubscribe();
```

</details>

<details>
<summary>
<code>watchBlockWithTransactions()</code> - watch for new blocks (real-time)
</summary>

**Example**

Watch for new blocks on Ethereum.

```js
import { watchBlockWithTransactions } from "@thirdweb-dev/sdk";

const unsubscribe = watchBlockWithTransactions({
  network: "ethereum",
  onBlock: (blockWithTransactions) => {
    console.log("New block", blockWithTransactions);
    console.log("Transactions", blockWithTransactions.transactions);
  },
});

// Later unsubscribe from watching for new blocks
unsubscribe();
```

</details>

<details>
<summary>
<code>watchTransactions()</code> - watch for transactions for a given address (real-time)
</summary>

**Example**

Watch for transactions on USD Coin (USDC) contract address.

```js
import { watchTransactions } from "@thirdweb-dev/sdk";

const unsubscribe = watchTransactions({
  network: "ethereum",
  contractAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  onTransactions: (transactions) => {
    console.log("New transactions", transactions);
  },
});

// Later unsubscribe from watching for new transactions
unsubscribe();
```

</details>
