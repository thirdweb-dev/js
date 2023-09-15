---
"@thirdweb-dev/react": minor
---

# New ConnectWallet UI and APIs

This introduces a new UI for the ConnectWallet modal and some new APIs along with it.

### modalSize

ConnectWallet modal now has two sizes - "wide" and "compact".

The default is “wide” for desktop. Note that it's always “compact” on mobile device no matter what you pass in.

```tsx
<ConnectWallet modalSize="wide" />
```

```tsx
<ConnectWallet modalSize="compact" />
```

### New default wallets

- MetaMask
- Coinbase Wallet
- WalletConnect
- Trust Wallet
- Rainbow
- Zerion Wallet
- Phantom

### Theme Customization

`ConnectWallet`, `Web3Button` and `ThirdwebProvider`'s `theme` prop now also takes an object which you can use to create a custom theme.

To do this, there are two new functions `darkTheme()` and `lightTheme()` to create this theme object

```ts
import { darkTheme } from '@thirdweb-dev/react'

const customDarkTheme = darkTheme({
  fontFamily: 'Inter, sans-serif',
  color: {
    modalBg: 'black',
    accentText: 'red',
    // ...etc
  }
})

<ConnectWallet theme={customDarkTheme} />
```

### Show a wallet as “recommended”

call the wallet configurator function with `{ recommended: true }`

recommended wallets are shown at the top of the list

```tsx
<ThirdwebProvider
  supportedWallets={[
    metamaskWallet({
      recommended: true,
    }),
    coinbaseWalletWallet({
      recommended: true,
    }),
  ]}
>
  <App />
</ThirdwebProvider>
```

### Show Terms of Service and/or Privacy policy links

```tsx
<ConnectWallet
  termsOfServiceUrl="https://...."
  privacyPolicyUrl="https://...."
/>
```

### Customize the “Welcome Screen” or Render your own

The "wide" ConnectWallet modal renders a default welcome screen on the right side which you can customize the texts and image of or completely replace with your own component.

```tsx
// Customize texts and logo

<ConnectWallet
  welcomeScreen={{
    title: "YOUR TITLE",
    subtitle: "YOUR SUBTITLE",
    img: {
      src: "https://...",
      width: 300,
      height: 50,
    },
  }}
/>

// or render your own component

<ConnectWallet
	welcomeScreen={() => {
		return <div> ... </div>
	}}
/>
```

### ConnectWallet’s props are exposed to Web3Button as well

`Web3Button`` renders a `ConnectWallet``component when the user is not connected, now you can customize that`ConnectWallet`by passing props for it via`connectWallet` object

```tsx
<Web3Button
  connectWallet={{
    modalTitle: "Login",
    modalSize: "compact", // etc..
  }}
/>
```
