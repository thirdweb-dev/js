---
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/react": patch
---

- add `selectUI` api in `WalletConfig` to allow rendering a custom UI for selecting a wallet
- Render an input for paper wallet and magic link using `selectUI` api
- export hook `useWalletModalConfig` and `useSetWalletModalConfig` for saving a data from `selectUI` to be used in `connectUI`
- add prop `modalTitle` on `ConnectWallet` to configure a custom title for the modal
