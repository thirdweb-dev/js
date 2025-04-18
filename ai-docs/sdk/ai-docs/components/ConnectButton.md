# ConnectButton

## <!--

title: ConnectButton
category: component

---

-->

## Description

`ConnectButton` renders an opinionated wallet‑connect UI that allows users to:

1. Select a wallet (in‑app, injected, WalletConnect, etc.)
2. Authorise the connection
3. View wallet details (address, balance, NFTs) and manage the session

It handles network switching, auto‑reconnect, SIWE authentication, account‑abstraction, and integrates thirdweb **Pay** flows. You can drop it into any React/Next.js app and customise nearly every aspect via props.

## Quick Start

```tsx
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, darkTheme } from "thirdweb/react";
import { polygon } from "thirdweb/chains";

const client = createThirdwebClient({ clientId: "YOUR_ID" });

export default function Page() {
  return <ConnectButton client={client} chain={polygon} theme={darkTheme()} />;
}
```

## Core Props (cheat‑sheet)

| Prop           | Type                                | Default              | Purpose                                              |
| -------------- | ----------------------------------- | -------------------- | ---------------------------------------------------- |
| `client`       | `ThirdwebClient`                    | —                    | SDK entrypoint (required)                            |
| `chain`        | `Chain`                             | undefined            | Ensure wallet connects to a specific chain           |
| `chains`       | `Chain[]`                           | undefined            | Multi‑chain support list                             |
| `wallets`      | `Wallet[]`                          | default wallets      | Limit wallets shown                                  |
| `theme`        | `"dark" \| "light" \| Theme`        | `"dark"`             | UI theming                                           |
| `autoConnect`  | `boolean \| { timeout: number }`    | `{ timeout: 15000 }` | Auto‑reconnect behaviour                             |
| `connectModal` | `ConnectButton_connectModalOptions` | —                    | Customise the connect modal (title, size, TOS, etc.) |
| `detailsModal` | `ConnectButton_detailsModalOptions` | —                    | Customise post‑connect details modal                 |
| `onConnect`    | `(wallet) => void`                  | —                    | Callback when a wallet connects                      |
| `onDisconnect` | `(info) => void`                    | —                    | Callback when user disconnects                       |

For the full prop surface see `ConnectButtonProps` type.

## Examples

### Minimal

```tsx
<ConnectButton client={client} />
```

### Custom button label + autoConnect off

```tsx
<ConnectButton
  client={client}
  autoConnect={false}
  connectButton={{ label: "Sign in" }}
/>
```

### SIWE authentication required

```tsx
<ConnectButton
  client={client}
  auth={{
    domain: "example.com",
    statement: "Sign to authenticate",
  }}
/>
```

### Account‑abstraction gasless setup

```tsx
import { sepolia } from "thirdweb/chains";

<ConnectButton
  client={client}
  accountAbstraction={{
    factoryAddress: "0xFactory",
    chain: sepolia,
    gasless: true,
  }}
/>;
```

## Signature

```tsx
function ConnectButton(props: ConnectButtonProps): JSX.Element;
```

## Related

- `useActiveAccount` hook
- `useConnect` hook
- [`ConnectEmbed`](/components/ConnectEmbed.md)
- [`ConnectButtonProps` type](https://portal.thirdweb.com/references/typescript/v5/ConnectButtonProps)
