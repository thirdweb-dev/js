# Contributing to thirdweb

## Getting Started

To get started, read the [How this repo works](#how-this-repo-works) section below to learn about the structure of this repo.

From there, you can take a look at our [Good First Issues](https://github.com/thirdweb-dev/js/labels/good%20first%20issue) board and find an issue that interests you!

<br />

## How this repo works

We use [Turborepo](https://turbo.build/repo/docs) to manage the repository, and help speed up the [CI/CD](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) pipeline to ship to production faster 🚢. Turborepo is a project dependency, and doesn't need to be installed separately.

We use [pnpm](https://pnpm.io) for package management across the repo. `pnpm` is similar to `npm` or `yarn` but with more efficient disk space usage.

**With the v5 SDK, we've consolidated everything into a single project at [/packages/thirdweb](../packages/thirdweb). You can still find the legacy packages at [/legacy_packages](../legacy_packages).**

This single package provides a performant & lightweight SDK to interact with any EVM chain across Node, React, and React Native. Learn more about how to use the thirdweb SDK in our [documentation](https://portal.thirdweb.com/typescript/v5).

<br />

## How to contribute

Let's explore how you can set up the repo on your local machine and start contributing!

This section requires some existing knowledge of [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/) and [pnpm](https://pnpm.io/).

<br />

### Getting the repo

For OSS contributions, we use a [Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow), meaning each developer will fork the repo and work on their own fork; and then submit a PR to the main repo when they're ready to merge their changes.

To begin:

1. [Create a fork](https://github.com/thirdweb-dev/js/fork) of this repository to your own GitHub account.

2. [Clone your fork](https://help.github.com/articles/cloning-a-repository/) to your local device.

3. Create a new branch on your fork to start working on your changes:

   ```bash
   git checkout -b <YOUR BRANCH NAME>
   ```

4. Install the dependencies:
   ```bash
   pnpm install
   ```
   If you are on windows, use the `--ignore-scripts` flag
   ```bash
   pnpm install --ignore-scripts
   ```

Now you have the repo on your local machine, and you're ready to start making your changes!

<br/>

### Test Your Changes

#### Writing Unit Tests

Try to include unit test coverage with your changes where appropriate. We use `vitest` for testing, look for files with the `.test.ts` extension for examples of how to structure your unit tests.

To run your tests, run the following from the package directory (most likely /packages/thirdweb):

```bash
pnpm test:dev <YOUR TEST FILE PATH>
```

> Specifying your test file path is optional, but will save time by only running specific tests each time. Before opening your PR, run `pnpm test` from the monorepo root (without specifying your test file) to ensure your changes didn't break any existing tests.

Many of the tests use forked versions of live chains like mainnet. We fork these chains at a specific arbitrary block number so results are consistent across test runs. If you're interacting with on-chain data, you can write tests that interact with real contracts at the same block number by using `FORKED_ETHEREUM_CHAIN`. However, if you don't need to interact with existing contracts, we recommend running your tests against `ANVIL_CHAIN`.

If you need to use accounts in your tests, use the predefined accounts in `test/src/test-wallets.ts`. These are the default anvil accounts that are pre-funded on the local test forks.

##### Mocking Network Calls

If your test depends on a downstream network call, you must mock the call using `msw`. You can use one of the existing mocks in `test/src/mocks` or create your own. Once you've created a mock request, setup the server and add all your mocks like so:

```ts
import { setupServer } from "msw/node";
import { downloadMock, uploadMock } from "../../../test/src/mocks/storage.js";

const server = setupServer(
  uploadMock("HASH"),
  downloadMock({ name: "Test NFT" })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Linting

We use a linter to maintain best practices across projects. Once your changes are complete (or periodically while making changes), run the linter with the following command from the repo root:

```bash
pnpm lint
```

If there are errors, try running `pnpm fix` to auto-fix any basic errors. Other linter errors, like missing documentation, will need to be fixed manually. See existing files for examples of inline documentation.

#### Testing on the Demo Apps

You can test your changes on any of the demo apps within the `/apps` directory without linking or publishing your changes to npm. When you run `pnpm dev` from the root directory, turbo will start the demo apps and watch the dependent packages for changes. Any time you make a change anywhere in the repo, the apps will hot reload and the changes will be reflected in the browser.

#### Testing from npm

You can also test your changes by publishing a dev package to npm and adding your package as you normally do in your projects.

**Once you have your PR up** you can add a comment with the text: `/release-pr`. This will trigger a GitHub action that will publish a dev version to npm.

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

### Test Your Changes (React Native)

The repository does not yet have a React Native playground, so some additional steps are needed to test any React Native SDK changes.

#### Create a Local React Native Project

For ease of setup, we recommend using the React Native SDK template project as a local testing playground. To generate this project, just run `npx thirdweb create --react-native`.

#### Linking Your Local Changes

To use the local version of the SDK while listening for changes in your React Native project, we'll use [wml](https://www.npmjs.com/package/wml). To install wml, run `npm i -g wml`.

Once installed, edit the project's `package.json` so the thirdweb package points to your local version of the repository (rather than a version number). It should look something like this:

```json
"thirdweb": "/Users/me/Desktop/js/packages/thirdweb/"
```

Now we'll add a wml link between your React Native project and this local repository:

```bash
wml add /[Path to this repository on your machine]/packages/thirdweb /[Path to your RN project]/node_modules/thirdweb
```

Run `wml list` to confirm you've added the connection successfully.

Now run `wml start` to start the connection between your two projects. wml will watch for changes in the first directory you specified and copy them to the second.

However, for this to work you'll also need to setup [watchman](https://facebook.github.io/watchman/) on wml (confusing, I know). First, install watchman with homebrew or another installer.

Once watchman is installed, find where wml's src is. You can normally do this by running `which wml` to find your node directory, then adding `/lib/node_modules/wml/src` from the root path of your current node version. It should look something like this: `/Users/me/.nvm/versions/node/v20.13.0/lib/node_modules/wml/src`

Now, run watchman on this path with `watchman watch /Users/me/.nvm/versions/node/v20.13.0/lib/node_modules/wml/src`

Finally, navigate to the V5 SDK package with `cd packages/thirdweb` and run it in dev mode to rebuild on changes with `pnpm dev:esm`.

You should now have:

1. `wml` running in one terminal window, watching your local SDK and your React Native project
2. `watchman` set to watch your `wml` src directory
3. `pnpm dev:esm` running in `packages/thirdweb`
4. The "thirdweb" dependency in your RN `package.json` pointing to `packages/thirdweb` of your local version of this repository

Try making changes in the SDK to see if they affect your React Native project. If they don't, try deleting your RN project `node_modules`, reinstalling via yarn (the preferred package manager for React Native), and trying again.

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
git push origin <YOUR BRANCH NAME>
```

4. Create a [pull request](https://www.atlassian.com/git/tutorials/making-a-pull-request) to the `main` branch of the official (not your fork) SDK repo.
