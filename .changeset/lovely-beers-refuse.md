---
"@thirdweb-dev/react": patch
---

- Fix the closing of ConnectWallet after the wallet connection instead of showing the "Sign In" screen when Auth is enabled

- Call the `onConnect` prop on `ConnectWallet` and `ConnectEmbed` component with the connected wallet instance

```tsx
<ConnectWallet
  onConnect={(wallet) => {
    console.log("Connected to:", wallet);
  }}
/>
```

```tsx
<ConnectEmbed
  onConnect={(wallet) => {
    console.log("Connected to:", wallet);
  }}
/>
```

- Improved Sign in Screen UI for Embedded Wallet and Local Wallet with Retry and Disconnect buttons after failed sign in
