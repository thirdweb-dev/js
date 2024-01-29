# Setup Comparison

## `thirdweb@alpha`

### Install

```bash
npm install thirdweb@alpha
```

### Hello World

```javascript
import { createClient, contract } from "thirdweb";
import { totalSupply } from "thirdweb/extensions/erc20";

const client = createClient({
  clientId: "<my-client-id>",
});

const myContract = contract({
  client,
  chainId: 1,
  address: "0x...",
});

const supply = await totalSupply({
  contract: myContract,
});
```

## `@thirdweb-dev/sdk`

### Install

```bash
npm install @thirdweb-dev/sdk ethers@^5
```

### Hello World

```javascript
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK(1, {
  clientId: "<my-client-id>",
});

const contract = await sdk.getContract({
  address: "0x...",
});

const supply = await contract.erc20.totalSupply();
```

## `viem`

### Install

```bash
npm install viem
```

### Hello World

```javascript
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// the ABI of the contract
const abi = [...];

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const supply = await client.readContract({
  address: "0x...",
  abi,
  functionName: "totalSupply",
});
```

## `ethers`

### Install

```bash
npm install ethers
```

### Hello World

```javascript
import { getDefaultProvider, Contract } from 'ethers'

// the ABI of the contract
const abi = [...];

const provider = getDefaultProvider()

// Create a contract
const contract = new Contract('0x...', abi, provider)
const supply = await contract.totalSupply()
```
