# Contributing to thirdweb

You can find a full video tutorial on how to contribute to thirdweb below:

https://www.youtube.com/watch?v=TXsQ3qok3B0

## Getting Started

To get started, read the [How this repo works](#how-this-repo-works) section below to learn about the structure of this repo.

From there, you can take a look at our [Good First Issues](https://github.com/thirdweb-dev/js/labels/good%20first%20issue) board and find an issue that interests you!

If you have any questions about the issue, feel free to ask on our [Discord server](https://discord.gg/thirdweb) in the `#contributors` channel; where you'll be able to get help from our team and other contributors.

<br/>

## How this repo works

[@thirdweb-dev/js](https://github.com/thirdweb-dev/js) is a monorepo, meaning it contains many projects within it.

We use [Turborepo](https://turborepo.org/docs/getting-started) to manage the monorepo, and help speed up the [CI/CD](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) pipeline to ship to production faster 🚢.

You can see a quick outline of each of the projects within this repo below, each living within the [/packages](/packages) directory:

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

This section requires some existing knowledge of [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/).

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
   pnpm install
   ```
   If you are on windows, use the `--ignore-scripts` flag
   ```
   pnpm install --ignore-scripts
   ```

Now you have got the repo on your local machine, and you're ready to start making your changes!

<br/>

### Test Your Changes

We use [yalc](https://github.com/wclr/yalc) to test changes locally.

Install the yalc CLI globally:

```bash
pnpm add yalc -g
```

First, create a test project where you can experiment with your changes:

You can create a basic starter project with the `sdk` and `react` packages installed using the CLI:

```bash
npx thirdweb create --app
```

Use `yalc` to link your local changes in the monorepo to the test project, by running the following command from your test repo:

```bash
yalc add @thirdweb-dev/react # Link the react package
yalc add @thirdweb-dev/sdk # Link the sdk package
# etc...
```

From the monorepo, run the following command to publish your local changes to the test project:

```bash
pnpm push
```

Now, each time you make a change to the monorepo, you can run `pnpm push` to publish your changes to the test project.

In your test project, you need to:

1. Delete the dependencies cache. If you're using Next.js, that is the `.next` directory, and if you're using CRA, that is the `node_modules/.cache` directory.
2. Restart the development server.

#### Testing from npm

You can also test your changes by publishing a dev package to npm and adding your package as you normally do in your projects.

Once you have your PR up you can add a comment with the text: `/release-pr`. This will trigger a GitHub action that will publish a dev version to npm.

You can see the action progress in GitHub's `Actions` tab, look for the workflow: `release-pr`.

Once the action finishes executing, select it, click on deploy and look for the `Deploy pre-release` item. Scroll all the way to the bottom and you should see something like:

```
success packages published successfully:
🦋  @***-dev/auth@0.0.0-dev-06a7cb1-20230901190619
🦋  @***-dev/react@0.0.0-dev-06a7cb1-20230901190619
...
```

These are the versions the GH action published to npm for testing purposes. Let's assume you're working on the `@thirdweb-dev/react` package, you can then run:

`yarn add @thirdweb-dev/react@0.0.0-dev-06a7cb1-20230901190619` to install the dev package.

<br/>

### Publish Your Changes

Once you're satisfied with your changes, you are ready to submit them for review!

1. Use [changeset](https://github.com/changesets/changesets) to generate a changeset file:

```
pnpm changeset
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
