---
"thirdweb": minor
---

Introducing Nebula API

You can now chat with Nebula and ask it to execute transactions with your wallet.

Ask questions about real time blockchain data.

```ts
import { Nebula } from "thirdweb/ai";

const response = await Nebula.chat({
  client: TEST_CLIENT,
  prompt:
    "What's the symbol of this contract: 0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
  context: {
    chains: [sepolia],
  },
});

console.log("chat response:", response.message);
```

Ask it to execute transactions with your wallet.

```ts
import { Nebula } from "thirdweb/ai";

const wallet = createWallet("io.metamask");
const account = await wallet.connect({ client });

const result = await Nebula.execute({
  client,
  prompt: "send 0.0001 ETH to vitalik.eth",
  account,
  context: {
    chains: [sepolia],
  },
});

console.log("executed transaction:", result.transactionHash);
```
