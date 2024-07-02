# React Native Adapter

This package is required to run the thirdweb connect SDK in React Native.

## Instructions

### 1. Install the packages

Using your favorite pacakge manager, install all the require dependencies

```shell
npx expo install thirdweb @thirdweb-dev/react-native-adapter
```

Since react native requires installing native dependencies directly, you also have to install these required peer dependencies:

```shell
npx expo install react-native-get-random-values @react-native-community/netinfo expo-application @react-native-async-storage/async-storage expo-web-browser expo-linking react-native-aes-gcm-crypto react-native-quick-crypto@0.7.0-rc.6 amazon-cognito-identity-js @coinbase/wallet-mobile-sdk react-native-mmkv react-native-svg @react-native-clipboard/clipboard
```

Here's an explanation of each peer dependency and why its needed:

```
// needed for wallet connect
react-native-get-random-values
@react-native-community/netinfo
expo-application

// needed wallet connect + in-app wallet
@react-native-async-storage/async-storage

// needed for inapp wallet
expo-web-browser // for oauth flows
amazon-cognito-identity-js // for authentication
react-native-aes-gcm-crypto // for encryption
react-native-quick-crypto@0.7.0-rc.6 //for fast hashing

// needed for the prebuilt UIs
react-native-svg
@react-native-clipboard/clipboard
```

### 2. Edit your `metro.config.js`

If you don't already have a `metro.config.file.js` in your project, you can create one by running:

```shell
npx expo customize metro.config.js
```

Then, you need to add 2 properties to the metro resolver: `unstable_enablePackageExports` and `unstable_conditionNames`. This is to tell metro to resolve named `exports` properly.

```js
// file: metro.config.js

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ADD THESE 2 PROPERTIES
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
	"react-native",
	"browser",
	"require",
];

module.exports = config;
```

### 3. Import `@thirdweb-dev/react-native-adapter` at the top of your `App.tsx`

This will polyfill all the required functionality needed.

```js
// this needs to be imported before anything else
import "@thirdweb-dev/react-native-adapter";
// the rest of your app
```

If you're using `expo-router`, you need to polyfill before the router entry:

1. create a `app/index.ts`

This will be the new entrypoint to your app, ensuring the polyfills happen before any routing.

```ts
// file: app/index.ts

// this needs to be imported before expo-router
import "@thirdweb-dev/react-native-adapter";
import "expo-router/entry";
```

2. Change your main entrypoint in `package.json`

Now you can replace `expo-router/entry` with `./app/index` as your main entrypoint.

```
// file: package.json

"main": "./app/index",
```

### Additional notes

1. `react-native-aes-gcm-crypto` requires `minSDK 26` for android, you can edit this in your `build.gradle` file
2. You will get some warnings about unresolved exports, this is normal and  will get better as the libraries get updated.


### Use the `thirdweb` package in React Native

Once all the setup above is all done, you can use the most of functionality in the `thirdweb` package out of the box, without having to do any react native specific code.

This means that you can follow all the React documentation and expect it all to be exactly the same.

Examples:

```tsx
import { ThirdwebProvider } form "thirdweb/react";
```

### Resources

- [Full working demo](https://github.com/thirdweb-dev/expo-starter)
- [React docs](https://portal.thirdweb.com/typescript/v5/react)
- [TypeScript docs](https://portal.thirdweb.com/typescript/v5)
