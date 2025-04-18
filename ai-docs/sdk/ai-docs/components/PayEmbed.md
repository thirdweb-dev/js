# PayEmbed

## <!--

title: PayEmbed
category: component

---

-->

## Description

`PayEmbed` is a powerful, self‑contained widget that lets users **buy tokens, fund their wallet, or make direct payments** with either crypto or fiat – all inside your dApp. It wraps wallet‑connection logic, token selection, on‑ramp providers, and thirdweb’s transaction services into a single drop‑in React component.

Use it for:

- On‑boarding users who don’t yet own crypto
- Selling digital goods (NFTs, in‑app items) via direct payments
- Topping‑up smart‑account balances before gas‑sponsored actions

## Quick Start

```tsx
import { createThirdwebClient } from "thirdweb";
import { PayEmbed } from "thirdweb/react";

const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" });

export default function Checkout() {
  return <PayEmbed client={client} />;
}
```

## Core Props (cheat‑sheet)

| Prop                  | Type                         | Required | Purpose                                                                          |
| --------------------- | ---------------------------- | -------- | -------------------------------------------------------------------------------- |
| `client`              | `ThirdwebClient`             | ✅       | SDK entrypoint                                                                   |
| `payOptions`          | `PayUIOptions`               | —        | Configure mode (`fund_wallet` \| `direct_payment` \| `transaction`) and metadata |
| `supportedTokens`     | `SupportedTokens`            | —        | Override default token list per chain                                            |
| `theme`               | `"dark" \| "light" \| Theme` | —        | UI theming                                                                       |
| `locale`              | `LocaleId`                   | —        | Localise UI strings                                                              |
| `connectOptions`      | `PayEmbedConnectOptions`     | —        | Fine‑tune the underlying Connect flow                                            |
| `style` / `className` | React styling                | —        | Container styling                                                                |

## Common Recipes

### 1. Fund wallet (default)

```tsx
<PayEmbed client={client} payOptions={{ mode: "fund_wallet" }} />
```

### 2. Direct payment for merchandise

```tsx
import { base, getDefaultToken } from "thirdweb/chains";

<PayEmbed
  client={client}
  theme="light"
  payOptions={{
    mode: "direct_payment",
    paymentInfo: {
      amount: "35",
      chain: base,
      token: getDefaultToken(base, "USDC"),
      sellerAddress: "0xSeller",
    },
    metadata: {
      name: "Black Hoodie (Size L)",
      image: "/hoodie.png",
    },
  }}
/>;
```

### 3. Gasless transaction top‑up

```tsx
<PayEmbed
  client={client}
  payOptions={{
    mode: "transaction",
    transaction: preparedTx, // output of prepareContractCall
  }}
/>
```

## Signature

```tsx
function PayEmbed(props: PayEmbedProps): JSX.Element;
```

See [`PayEmbedProps`](https://portal.thirdweb.com/references/typescript/v5/PayEmbedProps) and [`PayUIOptions`](https://portal.thirdweb.com/references/typescript/v5/PayUIOptions) for the full, exhaustive type definitions.

## Related

- `ConnectButton` \- under‑the‑hood connect flow
- Transaction helpers: `prepareContractCall`, `sendTransaction`
- [`PayUIOptions` type](https://portal.thirdweb.com/references/typescript/v5/PayUIOptions)
