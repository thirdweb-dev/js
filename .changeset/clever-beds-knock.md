---
"thirdweb": minor
---

Feature: Adds beta support for EIP-7702 authorization lists

```ts
import { prepareTransaction, sendTransaction, signAuthorization } from "thirdweb";

const authorization = await signAuthorization({
    request: {
        address: "0x...",
        chainId: 911867,
        nonce: 100n,
    },
    account: myAccount,
});

const transaction = prepareTransaction({
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
    value: 100n,
    to: TEST_WALLET_B,
    authorizationList: [authorization],
});

const res = await sendTransaction({
    account,
    transaction,
});
```

