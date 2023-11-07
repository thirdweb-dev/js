---
"@thirdweb-dev/react": patch
---

Add Localization API to change language used in components `ConnectWallet` and `Web3Button` and/or override the default texts

### Japanese

```tsx
import { ja } from "@thirdweb-dev/react";

const japanese = ja();

<ThirdwebProvider locale={japanese}>
  <App />
</ThirdwebProvider>;
```

### Spanish

```tsx
import { es } from "@thirdweb-dev/react";

const spanish = es();

<ThirdwebProvider locale={spanish}>
  <App />
</ThirdwebProvider>;
```

### English ( default )

```tsx
import { en } from "@thirdweb-dev/react";

const english = en();

<ThirdwebProvider locale={english}>
  <App />
</ThirdwebProvider>;
```

This API also allows overriding the default texts in the locale object. You can override all the texts or just some parts

```tsx
import { en } from "@thirdweb-dev/react";

// override some texts
const english = en({
  connectWallet: {
    confirmInWallet: "Confirm in your wallet",
  },
  wallets: {
    metamaskWallet: {
      connectionScreen: {
        inProgress: "Awaiting Confirmation",
        instruction: "Accept connection request in your MetaMask wallet",
      },
    },
  },
});

<ThirdwebProvider locale={english}>
  <App />
</ThirdwebProvider>;
```
