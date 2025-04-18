# useActiveAccount

## <!--

title: useActiveAccount
category: hook

---

-->

## Description

`useActiveAccount` is a React hook that returns the currently connected wallet **Account** (or `undefined` when the user is not connected). It subscribes to the wallet connection manager and reacts to connection / disconnection events in real time.

The returned object matches the `Account` type from the SDK which includes the wallet **address** and **chain** information.

## Usage

```tsx
import { useActiveAccount } from "thirdweb/react"; // or "thirdweb" entrypoint for React bundlers

function ConnectedLabel() {
  const account = useActiveAccount();

  if (!account) return <p>Not connected</p>;

  return (
    <p>
      Connected as <code>{account.address}</code> on chain {account.chain.id}
    </p>
  );
}
```

Combine with a connect UI:

```tsx
import { ConnectButton } from "thirdweb/react";

export default function Page() {
  return (
    <>
      <ConnectButton />
      <ConnectedLabel />
    </>
  );
}
```

## Signature

```ts
function useActiveAccount(): Account | undefined;
```

> The hook internally calls `useSyncExternalStore` so it is **safe for React Server Components** and will hydrate correctly on the client.

## Related

- `ConnectButton` component
- `useConnect` hook
- [`Account` type](../types/Account.md)
