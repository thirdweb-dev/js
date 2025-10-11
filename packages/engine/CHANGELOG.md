# @thirdweb-dev/engine

## 3.3.0

### Minor Changes

- [#8238](https://github.com/thirdweb-dev/js/pull/8238) [`9545b43`](https://github.com/thirdweb-dev/js/commit/9545b4367598408dbb88c63d8a8fe21305f870b5) Thanks [@d4mr](https://github.com/d4mr)! - Add Solana endpoints

## 3.2.2

### Patch Changes

- [#8218](https://github.com/thirdweb-dev/js/pull/8218) [`f630912`](https://github.com/thirdweb-dev/js/commit/f630912b9b0e1d8ebe22b0b52c650f5e40e12baf) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update to latest API spec

## 3.2.1

### Patch Changes

- [#7652](https://github.com/thirdweb-dev/js/pull/7652) [`620e294`](https://github.com/thirdweb-dev/js/commit/620e294f8ce59e8ec217e3984177ac6dd6d48772) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update to latest API

## 3.2.0

### Minor Changes

- [#7427](https://github.com/thirdweb-dev/js/pull/7427) [`f9d7935`](https://github.com/thirdweb-dev/js/commit/f9d7935d848cbb2dea3f5204d5bff69cd0c3a921) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - New engine v3 APIs - see changelog for breaking changes

## 3.1.0

### Minor Changes

- [#7431](https://github.com/thirdweb-dev/js/pull/7431) [`1387337`](https://github.com/thirdweb-dev/js/commit/1387337955a38f1527266b0a6146bb18d86426aa) Thanks [@PaoloRollo](https://github.com/PaoloRollo)! - update hey-api version to 0.76.0

## 3.0.4

### Patch Changes

- [#7429](https://github.com/thirdweb-dev/js/pull/7429) [`ef2895f`](https://github.com/thirdweb-dev/js/commit/ef2895fa2c30b8b8b5250dadb05e3f5d125c9e4d) Thanks [@d4mr](https://github.com/d4mr)! - Support EOA Execution Options for Server Wallets

## 3.0.3

### Patch Changes

- [#7190](https://github.com/thirdweb-dev/js/pull/7190) [`861e623`](https://github.com/thirdweb-dev/js/commit/861e623a1b7519bcac09c0c6d975cad2c0c5be4f) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Updated to latest API

## 3.0.2

### Patch Changes

- [#7158](https://github.com/thirdweb-dev/js/pull/7158) [`ec7bc2b`](https://github.com/thirdweb-dev/js/commit/ec7bc2bb1e58f1a45d01eec0f308bc0f86479050) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - client id optional

## 3.0.1

### Patch Changes

- [#7050](https://github.com/thirdweb-dev/js/pull/7050) [`ae2ff74`](https://github.com/thirdweb-dev/js/commit/ae2ff743c05be7267e904ece9098601794b10dd9) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update openAPI spec

## 1.0.0

### Major Changes

- [#6706](https://github.com/thirdweb-dev/js/pull/6706) [`185d2f3`](https://github.com/thirdweb-dev/js/commit/185d2f309c349e37ac84bd3a2ce5a1c9c7011083) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Initial release of dedicated insight TS sdk

  This package is a thin openAPI wrapper for insight, our in-house indexer.

  ## Configuration

  ```ts
  import { configure } from "@thirdweb-dev/insight";

  // call this once at the startup of your application
  configure({
    clientId: "<YOUR_CLIENT_ID>",
  });
  ```

  ## Example Usage

  ```ts
  import { getV1Events } from "@thirdweb-dev/insight";

  const events = await getV1Events({
    query: {
      chain: [1, 137],
      filter_address: "0x1234567890123456789012345678901234567890",
    },
  });
  ```
