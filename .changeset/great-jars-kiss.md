---
"@thirdweb-dev/react-native": patch
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/chains": patch
"@thirdweb-dev/react": patch
---

- add `theme` in `ConfiguredWallet.connectUI`'s props - to use theme aware UI for wallets
- add `useWalletConfig` hook to get the `ConfiguredWallet` object for active wallet
- add hooks `useSetConnectedWallet`, `useSetConnectionStatus`
- rename `useActiveChain` to `useChain` - keep the `useActiveChain` also with deprecated tag
- make `useSafe` hook await-able by returning the promise of connect() call
- add hook `useSmartWallet`
- allow rendering custom wallet details button via `<ConnectWallet detailsButton={} />` prop
- Rename "Export" to "Backup" in local wallet UI
