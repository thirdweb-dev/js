---
"@thirdweb-dev/sdk": minor
---

SDK update - Now supports Any EVM - Any Contract!

- Can now create a `ThirdwebSDK` instance passing: chain id (any EVM chain) / chain name (only supported ones) / RPC url / Provider / Signer
- Ability to pass and override any chain information in the new `chainInfos` property of the `SDKOptions`
- Support for local nodes! Use the convenience `ThirdwebSDK.fromLocalNode()` to interact with contracts and wallets on your local node
- Any contract can now be used without passing any ABI, simply by importing the contract on thirdweb.com/chain/contract_address
