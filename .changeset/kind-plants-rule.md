---
"@thirdweb-dev/auth": major
---

Complete Auth redesign and update to add a number of major and quality of life improvements, including the following:

- Ability to use Auth APIs with both cookies and JWTs, allowing non browser clients to interact with Auth (mobile, gaming, scripts, etc.)
- Ability to store session data and other data on the Auth user
- Callbacks to run side-effects on login, logout, and requesting user data
- Ability to configure cookies for custom domains and backend setups
- Support for validation of the entire EIP4361/CAIP122 specification
- No more need for redirects or payload encoding on Auth requests
- and more...

See the new documentation to view the new changes and usage: [Auth Documentation](https://portal.thirdweb.com/auth).

## How to upgrade

The `ThirdwebAuth` constructor now takes the `domain` in the constructor, and takes a more generic `wallet` interface as input. The `wallet` can be imported from the `@thirdweb-dev/wallets` package, or for more simpler use cases, from the `@thirdweb-dev/auth/evm` and `@thirdweb-dev/auth/solana` entrypoints.

```js
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";

// Pass in domain and wallet to the constructor
const wallet = new PrivateKeyWallet("0x...");
const auth = new ThirdwebAuth(wallet, "example.com");

// Auth functions no longer require domain to be passed in
const payload = await auth.login();
```
