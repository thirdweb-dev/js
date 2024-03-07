<p align="center">
    <br />
    <a href="https://thirdweb.com">
        <img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
    <br />
</p>

<h1 align="center"><a href='https://thirdweb.com/'>thirdweb</a> JavaScript/TypeScript SDK</h1>

<p align="center">
    <a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml">
        <img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/>
    </a>
    <a href="https://discord.gg/thirdweb">
        <img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/>
    </a>
</p>

<p align="center"><strong>All-in-one web3 SDK for Browser, Node and Mobile apps</strong></p>

## Features

- Support for React & React-Native
- First party support for [Embedded Wallets](https://portal.thirdweb.com/connect/embedded-wallet/overview) (social/email login)
- First party support for [Account Abstraction](https://portal.thirdweb.com/connect/account-abstraction)
- Instant connection to any chain with RPC Edge integration
- Integrated IPFS upload/download
- UI Components for connection, transactions, nft rendering
- High level contract extensions for interacting with common standards
- Automatic ABI resolution

## Unified SDK (Beta)

We now have a new version of the SDK available in beta:

Please refer to the following resources to get started:

- [GitHub Branch](https://github.com/thirdweb-dev/js/tree/beta)
- [Engineering Blog](https://blog.thirdweb.com/changelog/introducing-the-unified-thirdweb-sdk/)
- [Documentation](https://portal.thirdweb.com/typescript/v5)

## Library Comparison 

|                                           | thirdweb | Wagmi              | Viem               | Ethers@6 |
| ----------------------------------------- | -------- | ------------------ | ------------------ | -------- |
| Type safe contract API                    | ✅       | ✅                 | ✅                 | ✅       |
| Type safe wallet API                      | ✅       | ✅                 | ✅                 | ✅       |
| EVM utils                                 | ✅       | ❌                 | ✅                 | ✅       |
| RPC for any EVM                           | ✅       | ⚠️ public RPC only | ⚠️ public RPC only | ❌       |
| Automatic ABI Resolution                  | ✅       | ❌                 | ❌                 | ❌       |
| IPFS Upload/Download                      | ✅       | ❌                 | ❌                 | ❌       |
| Embedded wallet (email/ social login)     | ✅       | ⚠️ via 3rd party   | ❌                 | ❌       |
| Account abstraction (ERC4337) support     | ✅       | ⚠️ via 3rd party   | ⚠️ via 3rd party   | ❌       |
| Web3 wallet connectors                    | ✅       | ✅                 | ❌                 | ❌       |
| Local wallet creation                     | ✅       | ❌                 | ✅                 | ✅       |
| Auth (SIWE)                               | ✅       | ⚠️ via 3rd party   | ❌                 | ❌       |
| Extensions functions for common standards | ✅       | ❌                 | ❌                 | ❌       |
| React Hooks                               | ✅       | ✅                 | ❌                 | ❌       |
| React UI components                       | ✅       | ❌                 | ❌                 | ❌       |
| React Native Hooks                        | ✅       | ❌                 | ❌                 | ❌       |
| React Native UI Components                | ✅       | ❌                 | ❌                 | ❌       |

## Packages

| Package                                  | Description                                                                                                                                                                         
| -----------------------------------------|-----------------------------------------------------------------------------|
| [/sdk](./packages/sdk)                   | Best in class web3 SDK for Browser, Node and Mobile apps                    | 
| [/wallets](./packages/wallets)           | Unified web3 Wallet library to integrate any wallet into your applications. | 
| [/react](./packages/react)               | Ultimate collection of React hooks for your web3 apps                       |        
| [/react-native](./packages/react-native) | Ultimate collection of React hooks for your native mobile web3 apps         | 
| [/auth](./packages/auth)                 | Best in class wallet authentication for Node backends                       | 
| [/storage](./packages/storage)           | Best in class decentralized storage SDK for Browser and Node                | 
| [/cli](./packages/cli)                   | Publish and deploy smart contracts without dealing with private keys        | 
| [/chains](./packages/chains)             | All EVM chain information as JS objects for easy handling                   | 

## Contributing

We welcome contributions from all developers regardless of experience level. If you are interested in contributing, please read our [Contributing Guide](.github/contributing.md) to learn how the repo works, how to test your changes, and how to submit a pull request. 

See our [open source page](https://thirdweb.com/open-source) for more information on our open-source bounties and program. 

## Additional Resources

- [SDK Documentation](https://portal.thirdweb.com/typescript/v5)
- [Templates](https://thirdweb.com/templates)
- [YouTube](https://www.youtube.com/c/thirdweb_)


## Support 

For help or feedback, please [visit our support site](https://thirdweb.com/support)

## Security

If you believe you have found a security vulnerability in any of our packages, we kindly ask you not to open a public issue; and to disclose this to us by emailing `security@thirdweb.com`.
