---
"thirdweb": patch
---

Can now optionally specify `blockRange` on `getContractEvents` in combination with `toBlock` and `fromBlock`.

## Usage

Specify a `blockRange`, defaulting `toBlock` to the current block number.

```ts
await getContractEvents({
  contract: myContract,
  blockRange: 123456n,
  events: [preparedEvent, preparedEvent2],
});
```

Specify a block range with `toBlock`.

```ts
await getContractEvents({
  contract: myContract,
  toBlock: endBlock,
  blockRange: 123456n,
  events: [preparedEvent, preparedEvent2],
});
```

Specify a block range starting from `fromBlock` (great for pagination).

```ts
await getContractEvents({
  contract: myContract,
  fromBlock: lastBlockFetched,
  blockRange: 123456n,
  events: [preparedEvent, preparedEvent2],
});
```
