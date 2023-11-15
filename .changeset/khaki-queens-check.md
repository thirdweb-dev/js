---
"@thirdweb-dev/react-core": patch
"@thirdweb-dev/react": patch
---

- Added APIs in react-core to be able to "hide" a connection temporarily to avoid setting a intermediate wallet as "connected wallet" - For example: connecting a Safe requires connecting a personal wallet first and then connecting to Safe. Because of this - the app will show the personal wallet as connected for a brief moment. This API allows to hide the intermediate connection

- Add ConnectEmbed component to embed the ConnectWallet's Modal UI directly in page
