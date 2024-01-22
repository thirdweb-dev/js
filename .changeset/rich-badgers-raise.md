---
"@thirdweb-dev/react": minor
---

- Change ConnectWallet Details dropdown to a Modal with a few UI improvements.

  - Because of this the `dropdownPosition` prop has been removed from `ConnectWallet` component

- The "Request Testnet funds" button is now hidden by default in the new Modal UI.

  - You can add it back by setting `hideTestnetFaucet` to `false` in the `ConnectWallet` component.
