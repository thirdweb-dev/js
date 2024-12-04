# @thirdweb-dev/react-native-adapter

## 1.5.2

### Patch Changes

- [#5594](https://github.com/thirdweb-dev/js/pull/5594) [`b7c8854`](https://github.com/thirdweb-dev/js/commit/b7c885432726eeaf3401217573f2cff0f5247ff7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for Expo 52 and React Native 0.76

## 1.5.1

### Patch Changes

- [#5150](https://github.com/thirdweb-dev/js/pull/5150) [`9fadbcc`](https://github.com/thirdweb-dev/js/commit/9fadbcc17abfe302933f7b860ab7c3b4fb577789) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

- [#5151](https://github.com/thirdweb-dev/js/pull/5151) [`06c0cf3`](https://github.com/thirdweb-dev/js/commit/06c0cf3898419edc79ba042d041612a8ae6967f8) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - update to latest @mobile-wallet-protocol/client

## 1.5.0

### Minor Changes

- [#4992](https://github.com/thirdweb-dev/js/pull/4992) [`1994d9e`](https://github.com/thirdweb-dev/js/commit/1994d9e52d3a3874e6111ff7bc688f95618fbc25) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updated required dependencies

## 1.4.4

### Patch Changes

- [#4874](https://github.com/thirdweb-dev/js/pull/4874) [`783d844`](https://github.com/thirdweb-dev/js/commit/783d84467d81db856a1f0b3509036bbc612ba7e5) Thanks [@jnsdls](https://github.com/jnsdls)! - update dependencies

## 1.4.3

### Patch Changes

- [#4789](https://github.com/thirdweb-dev/js/pull/4789) [`e384001`](https://github.com/thirdweb-dev/js/commit/e38400195f2644ef8dfcfbce5fa127a9a218247d) Thanks [@MananTank](https://github.com/MananTank)! - Fix whitespaces in UI components

## 1.4.2

### Patch Changes

- [#4665](https://github.com/thirdweb-dev/js/pull/4665) [`6ce7c83`](https://github.com/thirdweb-dev/js/commit/6ce7c83a3b9eb2374ad2f8163d9c6a68bba4bc42) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update @mobile-wallet-protocol/client to 0.0.3

## 1.4.1

### Patch Changes

- [#4603](https://github.com/thirdweb-dev/js/pull/4603) [`b837b69`](https://github.com/thirdweb-dev/js/commit/b837b690ae27fb8bf45f6cd51820f7591e94dab0) Thanks [@jnsdls](https://github.com/jnsdls)! - bump various dependencies

## 1.4.0

### Minor Changes

- [#4527](https://github.com/thirdweb-dev/js/pull/4527) [`b76a82c`](https://github.com/thirdweb-dev/js/commit/b76a82c30345e06d7b2c203c1e20bf7ec7e0dd9d) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update React Native dependencies and add support for React Native 0.75

## 1.3.0

### Minor Changes

- [#4094](https://github.com/thirdweb-dev/js/pull/4094) [`f1d087e`](https://github.com/thirdweb-dev/js/commit/f1d087e24e8ad74948c0cdfa85d3705319753850) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Support for Coinbase Smart Wallet in React Native

  You can now use the Coinbase Smart Wallet in your React Native apps.

  ```ts
  const wallet = createWallet("com.coinbase.wallet", {
    appMetadata: {
      name: "My app name",
    },
    mobileConfig: {
      callbackURL: "https://example.com",
    },
    walletConfig: {
      options: "smartWalletOnly",
    },
  });

  await wallet.connect({
    client,
  });
  ```

## 1.2.0

### Minor Changes

- [#3271](https://github.com/thirdweb-dev/js/pull/3271) [`3a1fd98`](https://github.com/thirdweb-dev/js/commit/3a1fd985fc4b2720f4d46d54b562c00b2edf21ce) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Align inAppWallet secret sharing implementation with web and previous RN SDK

## 1.1.1

### Patch Changes

- [#3162](https://github.com/thirdweb-dev/js/pull/3162) [`b9b185b`](https://github.com/thirdweb-dev/js/commit/b9b185b665e9cc2085f0cc07e3a3cc06a755b42a) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Add support for CB wallet in react native

## 1.1.0

### Minor Changes

- [#3064](https://github.com/thirdweb-dev/js/pull/3064) [`f55fa4c`](https://github.com/thirdweb-dev/js/commit/f55fa4ca856924a0a1eb6b8e5fe743d76b6e2760) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - In-app wallet support for react native

### Patch Changes

- [#3110](https://github.com/thirdweb-dev/js/pull/3110) [`49aa6e4`](https://github.com/thirdweb-dev/js/commit/49aa6e41d5df93204821b72f17f1ba5c3cfe41f7) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Phone number sign in for React Native

## 1.0.0

### Major Changes

- [#3037](https://github.com/thirdweb-dev/js/pull/3037) [`f006429`](https://github.com/thirdweb-dev/js/commit/f006429d7c2415e9f2206e081f6b867854842f0b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - initial release
