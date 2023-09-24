---
"@thirdweb-dev/react": minor
"@thirdweb-dev/react-core": patch
---

## New smartWallet() API (Breaking Change)

### Before

In the previous API, adding a smart wallet created it's own new entry called "Smart wallet" in the ConnectWallet Modal and you had to pass in the personal wallets which was shown to the user when they clicked on the "Smart wallet".

```tsx
<ThirdwebProvider
  supportedWallets={[
    smartWalet({
      personalWallets: [metamaskWallet(), coinbaseWallet()],
      factoryAddress: "....",
      gassless: true,
    }),
  ]}
/>
```

### After

Since most users don't know what a smart wallet is, this was confusing. So with the new API, you can just use smart wallet under the hood for any wallet you want and it will just show up as that wallet and not a "smart wallet" in ConnectWallet Modal to improve the user experience.

Once the user is connected, the ConnectWallet Details button shows to the user that they are infact connected to a smart wallet.

```tsx
const config = {
  factoryAddress: "....",
  gassless: true,
}

<ThirdwebProvider
  supportedWallets={[
    smartWalet(metamaskWallet(), config),
    smartWalet(coinbaseWallet(), config),
  ]}
/>
```

## New Features added to `ConnectWallet` component

- ENS Name + Avatar support added
- New 'Send funds' button added to ConnectWallet which users can use to send various tokens.
- New "Receive funds" button added to ConnectWallet which users scan the QR code from their wallet app on phone to send funds to their other wallet on desktop
- Added `supportedTokens` prop to customize the list of tokens for each network in for the "Send Funds" screen.
- "Transaction history" button added to ConnectWallet which opens the block explorer
- New wallet `embededWallet()` to sign in with Google / Email
- Ability to show balance of any token instead of just native token in the ConnectWallet details button using the `displayBalanceToken` prop
