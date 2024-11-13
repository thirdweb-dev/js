---
"thirdweb": minor
---

Adds EIP1193 adapters that allow conversion between Thirdweb wallets and EIP-1193 providers:

- `EIP1193.fromProvider()`: Creates a Thirdweb wallet from any EIP-1193 compatible provider (like MetaMask, WalletConnect)
- `EIP1193.toProvider()`: Converts a Thirdweb wallet into an EIP-1193 provider that can be used with any web3 library

Key features:
- Full EIP-1193 compliance for seamless integration
- Handles account management (connect, disconnect, chain switching)
- Supports all standard Ethereum JSON-RPC methods
- Comprehensive event system for state changes
- Type-safe interfaces with full TypeScript support

Examples:

```ts
// Convert MetaMask's provider to a Thirdweb wallet
const wallet = EIP1193.fromProvider({
  provider: window.ethereum,
  walletId: "io.metamask"
});

// Use like any other Thirdweb wallet
const account = await wallet.connect({
  client: createThirdwebClient({ clientId: "..." })
});

// Convert a Thirdweb wallet to an EIP-1193 provider
const provider = EIP1193.toProvider({
  wallet,
  chain: ethereum,
  client: createThirdwebClient({ clientId: "..." })
});

// Use with any EIP-1193 compatible library
const accounts = await provider.request({
  method: "eth_requestAccounts"
});

// Listen for events
provider.on("accountsChanged", (accounts) => {
  console.log("Active accounts:", accounts);
});
```
