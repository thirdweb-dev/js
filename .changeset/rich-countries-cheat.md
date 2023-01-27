---
"@thirdweb-dev/sdk": minor
---

The `sdk.auth` namespace has been removed with Auth major upgrade. Instead, use the `ThirdwebAuth` import from the `@thirdweb-dev/auth` package.

```js
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

// Pass in domain and wallet to the constructor
const wallet = new PrivateKeyWallet("0x...");
const auth = new ThirdwebAuth(wallet, "example.com");

// Auth functions no longer require domain to be passed in
const payload = await auth.login();
```

Additionally, `AwsKmsWallet` and `AwsSecretsManager` wallets have been moved into the `@thirdweb-dev/wallets/evm` entrypoint from the SDK.

```js
import {
  AwsKmsWallet,
  AwsSecretsManagerWallet,
} from "@thirdweb-dev/wallets/evm";
```
