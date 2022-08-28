<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/typescript-sdk/blob/main/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb CLI</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@thirdweb-dev/cli"><img src="https://img.shields.io/npm/v/@thirdweb-dev/cli?color=red&logo=npm" alt="npm version"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

</p>
<p align="center"><strong>Publish and deploy smart contracts without dealing with private keys</strong></p>
<br />

## Getting started

The thirdweb CLI is your one-stop-shop for publishing custom contracts for your team or the world to use. The CLI uploads all necessary data to decentralized storage and makes it available to deploy via the thirdweb sdk or thirdweb dashboard.

This brings all the capabilities of thirdweb to your own custom contracts.

## Deploying your contract

```shell
npx thirdweb@latest deploy
```

This command will:

- auto-detect any contracts in your project
- compile your project
- Upload ABIs to IPFS
- Open the deploy flow in your thirdweb dashboard in a browser

From the thirdweb dashboard, you can review and deploy your contracts on any supported EVM chain.

Deploying contracts this way gives you access to:

- auto generated SDKs for react, node, python, go
- dashboards to manage, monitor and interact with your contracts

## Releasing your contract

```shell
npx thirdweb@latest release
```

Creates an official release of your contract, along with:

- author attribution
- contract information
- instructions on how to use and what it's for
- versioning
- release notes

Creating releases this way gives you shareable URL to let others to deploy your contracts in one click. It lets you manage released versions and get attribution for deployed contracts. Contract releases are registered on-chain (Polygon) and IPFS, for free (gasless).

Deploying released contracts give deployers access to automatic SDKs to integrate into their app and dashboards to manage and monitor the deployed contracts.

## Detecting contract extensions

```shell
npx thirdweb@latest detect
```

As you're developing your contracts, you may want to implement [Contract Extensions](https://portal.thirdweb.com/thirdweb-deploy/contract-extensions) to unlock functionality on the SDKs (ie. nft minting with automatic upload to IPFS) and the dashboard (ie. generated UI to manage permissions). This command will show what extensions were detected on your contract, unlocking the corresponding functionality on the SDKs and dashboard.

---

## Global installation

We recommend using npx to always get the latest version. Alternatively, you can install the CLI as a global command on your machine:

```shell
npm i -g @thirdweb-dev/cli
```

---

## Supported projects

To publish, you need to be in a directory that contains a project which the CLI is compatible
with. The projects we support so far:

- hardhat
- forge
- truffle
- solc

---

## Running the examples

Clone the repo and run this command after installing the CLI tool:

```bash
$ cd examples/hardhat
$ npx thirdweb@latest release
```

## Local Development

The simplest way to work on the CLI locally is to:

1. Install the package locally
2. Run the `build:watch` command to compile any changes in realtime

```bash
$ npm install -g ./
$ yarn run build:watch
```
