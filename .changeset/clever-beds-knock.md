---
"thirdweb": minor
---

Feature: Adds beta support for EIP-7702 authorization lists

```ts
import { prepareTransaction, sendTransaction } from "thirdweb";

const transaction = prepareTransaction({
    chain: ANVIL_CHAIN,
    client: TEST_CLIENT,
    value: 100n,
    to: TEST_WALLET_B,
    authorizations: [
        {
            address: "0x...",
            chainId: 1,
            nonce: 420n,
        },
    ],
});

const res = await sendTransaction({
    account,
    transaction,
});
```

You can access the underlying authorization signing functions like so:

```ts
import { signAuthorization, signedAuthorizations } from "thirdweb";

const signedAuthorization = await signAuthorization({
    authorization: {
        address: "0x...",
        chainId: 1,
        nonce: 420n,
    },
    account: myAccount,
});

const signedAuthorizations = await signedAuthorizations({
    authorizations: [
        {
            address: "0x...",
            chainId: 1,
            nonce: 420n,
        },
    ],
    account: myAccount,
});
```
