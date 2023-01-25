---
"@thirdweb-dev/sdk": minor
---

SDK update - Now supports Any EVM - Any Contract!

- Can now create a `ThirdwebSDK` instance passing: chain id (any EVM chain) / chain name (only supported ones) / RPC url / Provider / Signer
- Ability to pass and override any chain information in the new `chainInfos` property of the `SDKOptions`
- Support for local nodes! Simply create an SDK with `ChainId.Localhost` or your own local URL to interact with contracts and wallets on your local node
- While connected to a local node, request funds to the connected wallet using `await sdk.wallet.requestFunds(0.1)`
- Any contract can now be used without passing any ABI, simply by importing the contract on thirdweb.com/chain/contract_address
