---
"@thirdweb-dev/react": minor
---

Add `sections` prop and deprecate `popularChains` and `recentChains` for showing chains in sections in Network Selector screen in `ConnectWallet` component

```tsx
<ConnectWallet
  modalSize="wide"
  networkSelector={{
    sections: [
      {
        label: "Recently used",
        chains: [Optimism, Arbitrum],
      },
      {
        label: "Favorites",
        chains: [Polygon, Sepolia],
      },
      {
        label: "Popular",
        chains: [Ethereum, Base],
      },
    ],
  }}
/>
```
