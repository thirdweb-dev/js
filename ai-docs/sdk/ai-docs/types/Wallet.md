# Wallet & Account Types

## <!--

title: Wallet
category: type

---

-->

## Description

`Wallet` is an interface that abstracts a user's signing mechanism (EOA, browser extension, smart‑account wrapper). A wallet can expose multiple **Accounts**; in most cases `wallet.getAccount()` returns the primary account.

The SDK defines many wallet implementations (MetaMask, Coinbase Wallet, In‑App Wallet, Smart Wallet, etc.) all conforming to this interface so they can be used interchangeably by helpers and UI components.

## Key Properties & Methods

| Field                  | Type                         | Description                            |
| ---------------------- | ---------------------------- | -------------------------------------- |
| `id`                   | `WalletId`                   | Unique identifier like `"io.metamask"` |
| `getChain()`           | `() => Chain \| undefined`   | Currently connected chain              |
| `getAccount()`         | `() => Account \| undefined` | Active account                         |
| `connect()`            | `Prompt → Promise<Account>`  | UI flow to connect                     |
| `autoConnect()`        | `Promise<Account>`           | Silent reconnect if session exists     |
| `switchChain(chain)`   | `Promise<void>`              | Request network switch                 |
| `subscribe(event, cb)` | Wallet event emitter         |

Optional advanced methods include `signMessage`, `signTransaction`, `sendBatchTransaction`, `watchAsset`, etc.

## Account Interface

Every account has at minimum:

```ts
interface Account {
  address: Address;
  sendTransaction(tx): Promise<SendTransactionResult>;
  signMessage(opts): Promise<Hex>;
  // ...optional extras
}
```

## Example: programmatic transfer

```ts
const wallet = await createWallet("io.metamask").connect();
const account = wallet.getAccount();

await sendTransaction({
  account,
  transaction: transfer({ contract: usdc, to: dest, amountWei }),
});
```

## Related

- `createWallet` helper
- `ConnectButton` component
- Account vs Wallet guide
