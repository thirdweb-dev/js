# Hotlink 🔥🔗

### You are in Hotlink Mode

Hotlink mode allows you to use the packages in this repo locally in other repo with hot reload support.

This is only intended for testing out the packages locally, you must revert the hotlink before committing any changes.

### Revert Hotlink

```bash
yarn hotlink-revert
```

If you change package json files in this repo, you must also update `scripts/hotlink/changes.mjs` accordingly

<br/>

## Using the packages in other repository

Run following commands to use the packages in this repo to the other repo.

```bash
sudo yarn link @thirdweb-dev/react
sudo yarn link @thirdweb-dev/react-core
sudo yarn link @thirdweb-dev/sdk
```

### Reverting Symlinks

once you are done testing, you can revert the symlinks by running the following commands in the other repo.

```bash
sudo yarn unlink @thirdweb-dev/react
sudo yarn unlink @thirdweb-dev/react-core
sudo yarn unlink @thirdweb-dev/sdk

yarn --force
```

<br/>

## Next.js

You can use next.js's [transpilePackages](https://nextjs.org/docs/advanced-features/compiler#module-transpilation) option to use the packages in this repo directly in Next.js.

```js
// next.config.js

module.exports = {
  transpilePackages: [
    "@thirdweb-dev/react",
    "@thirdweb-dev/react-core",
    "@thirdweb-dev/sdk",
  ],
};
```

<br/>
