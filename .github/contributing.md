# Contributing to thirdweb

## Getting Started

To get started, read the [How this repo works](#how-this-repo-works) section below to learn about the structure of this repo.

From there, you can take a look at our [Good First Issues](https://github.com/thirdweb-dev/js/labels/good%20first%20issue) board and find an issue that interests you!

If you have any questions about the issue, feel free to ask on our [Discord server](https://discord.gg/thirdweb) in the `#contributors` channel; where you'll be able to get help from our team and other contributors.

<br/>

## How this repo works

[@thirdweb-dev/js](https://github.com/thirdweb-dev/js) is a monorepo, meaning it contains many projects within it.

We use [Turborepo](https://turborepo.org/docs/getting-started) to manage the monorepo, and help speed up the [CI/CD](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) pipeline to ship to production faster 🚢.

You can see a quick outline of each of the projects within this repo below, which each live within the [/packages](/packages) directory:

| Package                        | Description                                                          | Latest Version                                                                                                                                                                   |
| ------------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [/sdk](./packages/sdk)         | Best in class web3 SDK for Browser, Node and Mobile apps             | <a href="https://www.npmjs.com/package/@thirdweb-dev/sdk"><img src="https://img.shields.io/npm/v/@thirdweb-dev/sdk?color=red&label=npm&logo=npm" alt="npm version"/></a>         |
| [/react](./packages/react)     | Ultimate collection of React hooks for your web3 apps                | <a href="https://www.npmjs.com/package/@thirdweb-dev/react"><img src="https://img.shields.io/npm/v/@thirdweb-dev/react?color=red&label=npm&logo=npm" alt="npm version"/></a>     |
| [/auth](./packages/auth)       | Best in class wallet authentication for Node backends                | <a href="https://www.npmjs.com/package/@thirdweb-dev/auth"><img src="https://img.shields.io/npm/v/@thirdweb-dev/auth?color=red&label=npm&logo=npm" alt="npm version"/></a>       |
| [/storage](./packages/storage) | Best in class decentralized storage SDK for Browser and Node         | <a href="https://www.npmjs.com/package/@thirdweb-dev/storage"><img src="https://img.shields.io/npm/v/@thirdweb-dev/storage?color=red&label=npm&logo=npm" alt="npm version"/></a> |
| [/cli](./packages/cli)         | Publish and deploy smart contracts without dealing with private keys | <a href="https://www.npmjs.com/package/thirdweb"><img src="https://img.shields.io/npm/v/thirdweb?color=red&label=npm&logo=npm" alt="npm version"/></a>                           |
| [/solana](./packages/solana)   | Solana SDK for Browser, Node and React Native                        | <a href="https://www.npmjs.com/package/@thirdweb-dev/solana"><img src="https://img.shields.io/npm/v/@thirdweb-dev/solana?color=red&label=npm&logo=npm" alt="npm version"/></a>   |

## How to contribute

Let's explore how you can set up the repo on your local machine and start contributing!

This section requires some existing knowledge of [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/).

<br/>

### Getting the repo

For OSS contributions, we use a [Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow), meaning each developer will fork the repo and work on their own fork; and then submit a PR to the main repo when they're ready to merge their changes.

To begin:

1. [Create a fork](https://github.com/thirdweb-dev/js/fork) of this repository to your own GitHub account.

2. [Clone your fork](https://help.github.com/articles/cloning-a-repository/) to your local device.

3. Create a new branch on your fork to start working on your changes:

   ```
   git checkout -b MY_BRANCH_NAME
   ```

4. Install the dependencies:
   ```
   yarn
   ```

Now you have got the repo on your local machine, and you're ready to start making your changes!

<br/>

### Publish Your Changes

1. Use [changeset](https://github.com/changesets/changesets) to generate a changeset file:

   ```
   yarn changeset
   ```

   We follow [semantic versioning](https://semver.org/) for generating versioned releases of our packages (i.e. version = `MAJOR.MINOR.PATCH`)

   - Update `major` for breaking changes
   - Update `minor` for new features,
   - Update `patch` for non-breaking bug fixes, etc)

2. Commit the changeset along with your changes:

   ```
   git commit -am "My commit message"
   ```

3. Push your changes to the SDK:

   ```
    git push origin MY_BRANCH_NAME
   ```

4. Create a [pull request](https://www.atlassian.com/git/tutorials/making-a-pull-request) to the `main` branch of the official (not your fork) SDK repo.

   It's helpful to tag PRs with `[SDK]`, `[REACT]`, `[AUTH]`, (the name of the package you're modifying) to indicate the package that you are engaging with.

<br/>

### Testing Your Changes

When you make a pull request, your changes will be tested automatically by our CI/CD pipeline using [GitHub Actions](https://github.com/features/actions).

On your pull request, you can release your changes to a `dev` version by adding a **comment** with the following text:

```
/release-pr
```

This comment triggers the `release-pr` GitHub Action that publishes your changes to a `dev` version of the package(s) you are modifying.

Once this is done, you can test your changes by installing the `dev` version of the package(s).

If you don't already have a test project, you can use the [CLI](https://github.com/thirdweb-dev/thirdweb-cli) to create one:

```bash
npx thirdweb create
```

Inside your test project, you can install the `dev` version of the package(s) you are modifying.

For example, if you are modifying the `@thirdweb-dev/react` package, you can install the `dev` version of the package by running:

```
yarn add @thirdweb-dev/sdk@dev
```

This will install the `dev` version of the `@thirdweb-dev/react` package in your project, as you can see in the `package.json` file:

```diff
  "dependencies": {
-    "@thirdweb-dev/react": "^2",
+    "@thirdweb-dev/react": "^2.9.7-dev-b073878",
   }
```

You can now test your changes in your test project!
