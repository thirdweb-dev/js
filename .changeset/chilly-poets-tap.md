---
"thirdweb": patch
---

- Show ENS name and avatar in ConnectButton's Details Modal

- Add wallet ID alias `"embedded"` for `"inApp"` to avoid breaking change

```ts
createWallet("embedded") // supported but deprecated

createWallet("inApp") // recommended
````
