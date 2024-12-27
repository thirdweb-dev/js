---
"thirdweb": minor
---

Feature: Adds eagerDeployment option for smart accounts that need EIP-1271 signatures.

When setting `eagerDeployment` to `true`, smart accounts will use the legacy behavior of deploying prior to signing a message or typed data.

```ts
const wallet = smartWallet({
  chain,
  gasless: true,
  eagerDeployment: true,
});
```
