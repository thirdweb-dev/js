---
"@thirdweb-dev/react": minor
---

## Now supports Any EVM - Any Contract!

- no longer requires `desiredChainId` to be passed to `ThirdwebProvider`
- apps can now define the supported chains by passing `supportedChains` to `ThirdwebProvider`
- apps can now pass `activeChain` to `ThirdwebProvider` to define the chain out of the supported ones that the SDK should be initialized with
- if no `activeChain` is passed but a wallet is connected the SDK will be initialized with the chain of the connected wallet
- if no `activeChain` is passed and no wallet is connected the SDK will be initialized with the first chain of the `supportedChains` array

### Deprecated options

- `desiredChainId` is now deprecated and will be removed in the next major version. Please use `activeChain` instead.
- `chainRPC` is now deprecated and will be removed in the next major version. Please use `supportedChains` instead.

### Basic Setup

```diff
import { ThirdwebProvider } from "@thirdweb-dev/react";
- import { ChainId } from "@thirdweb-dev/sdk";

const App = () => {
- return <ThirdwebProvider desiredChainId={ChainId.Ethereum}>{...}</ThirdwebProvider>
+ return <ThirdwebProvider>{...}</ThirdwebProvider>
}
```

### Use a specific chain

```js
import { ThirdwebProvider } from "@thirdweb-dev/react";

const App = () => {
  // Polygon is a default chain, so you can pass the chain name without needing to define "supportedChains"
  return (
    <ThirdwebProvider activeChain="polygon">{/* {...} */}</ThirdwebProvider>
  );
};
```

### Use a non-default chain

```js
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const App = () => {
  // since there is only one supported chain defined this will automatically default the SDK to Sepolia
  return (
    <ThirdwebProvider supportedChains={[Sepolia]}>
      {/* {...} */}
    </ThirdwebProvider>
  );
};
```

### Use multiple chains including custom chains

```js
import { defaultChains, Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const App = () => {
  <ThirdwebProvider
    supportedChains={[...defaultChains, Sepolia]}
    activeChain="sepolia"
  >
    {/* {...} */}
  </ThirdwebProvider>;
};
```
