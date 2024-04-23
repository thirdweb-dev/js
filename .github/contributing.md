# Contributing to thirdweb

## Getting Started

To get started, read the [How this repo works](#how-this-repo-works) section below to learn about the structure of this repo.

From there, you can take a look at our [Good First Issues](https://github.com/thirdweb-dev/js/labels/good%20first%20issue) board and find an issue that interests you!

If you have any questions about the issue, feel free to ask on our [Discord server](https://discord.gg/thirdweb) in the `#contributors` channel; where you'll be able to get help from our team and other contributors.

<br />

## How this repo works

We use [Turborepo](https://turbo.build/repo/docs) to manage the repository, and help speed up the [CI/CD](https://www.atlassian.com/continuous-delivery/principles/continuous-integration-vs-delivery-vs-deployment) pipeline to ship to production faster 🚢. Turborepo is a project dependency, and doesn't need to be installed separately.

We use [pnpm](https://pnpm.io) for package management across the repo. `pnpm` is similar to `npm` or `yarn` but with more efficient disk space usage.

**With the v5 SDK, we've consolidated everything into a single project at [/packages/thirdweb](./packages/thirdweb). You can still find the legacy packages at [/legacy_packages](./legacy_packages).**

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

#### Linting

We use a linter to maintain best practices across projects. Once your changes are complete (or periodically while making changes), run the linter with the following command from the repo root:

```bash
pnpm lint
```

If there are errors, try running `pnpm fix` to auto-fix any basic errors. Other linter errors, like missing documentation, will need to be fixed manually. See existing files for examples of inline documentation.

#### Creating a Local Test Project

You can use [yalc](https://github.com/wclr/yalc) to test changes on a local project.

Install the yalc CLI globally:

```bash
pnpm add yalc -g
```

First, create a test project where you can experiment with your changes. This can be any node project that uses your changes.


Push your local version to your `yalc` store with:

```bash
pnpm build && pnpm push
```

Link your local changes in the monorepo to the test project by running the following command from your test repo:

```bash
yalc add thirdweb
```

Now, each time you make a change to the monorepo, you can run `pnpm push` from the monorepo then `yalc update thirdweb` from your test project to publish your latest changes to the test project.

If your changes modify dependencies, you may need to reinstall dependencies on your test project with `pnpm install`

To make sure your latest changes are used, in your test project you may need to:

1. Delete the dependencies cache. If you're using Next.js, that's the `.next` directory, and if you're using CRA, that's the `node_modules/.cache` directory.
2. Restart the development server.

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

