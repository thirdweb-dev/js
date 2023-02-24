<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb chains</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/chains"><img src="https://img.shields.io/npm/v/@thirdweb-dev/chains?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<!-- <p align="center"><strong>Best in class Web3 SDK for Browser, Node and Mobile apps</strong></p> -->
<br />

## Installation

```bash
yarn add @thirdweb-dev/chains
```

## Contributing

### Adding / Overriding Chain Data

Chain data is automatically pulled in from [ethereum-lists/chains](https://github.com/ethereum-lists/chains) on every build.

#### Overriding Chain Data

Chain data can be overridden by running `yarn override-chain` and following the prompts.

#### Adding A New Chain

In cases where a chain is not listed in the [ethereum-lists/chains](https://github.com/ethereum-lists/chains) repo, you can add it manually by running `yarn add-chain` and following the prompts.

> Prefer adding chains to the ethereum-lists/chains repo instead of manually adding them here.
