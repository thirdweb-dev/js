---
"thirdweb": patch
---

Adds the ability to hide certain wallets in the wallet switcher

```tsx
      <ConnectButton
        client={client}
        detailsModal={{
          // We hide the in-app wallet so they can't switch to it
          hiddenWallets: ["inApp"],
        }}
        accountAbstraction={{
          chain: baseSepolia,
          sponsorGas: true,
        }}
      />
```
