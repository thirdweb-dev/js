# @thirdweb-dev/insight

## 1.1.0

### Minor Changes

- [#7431](https://github.com/thirdweb-dev/js/pull/7431) [`1387337`](https://github.com/thirdweb-dev/js/commit/1387337955a38f1527266b0a6146bb18d86426aa) Thanks [@PaoloRollo](https://github.com/PaoloRollo)! - update hey-api version to 0.76.0

## 1.0.2

### Patch Changes

- [#7220](https://github.com/thirdweb-dev/js/pull/7220) [`4fed9f4`](https://github.com/thirdweb-dev/js/commit/4fed9f4593f32944f5189596d0736702f53a776b) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - Update to latest openAPI spec

## 1.0.1

### Patch Changes

- [#7158](https://github.com/thirdweb-dev/js/pull/7158) [`ec7bc2b`](https://github.com/thirdweb-dev/js/commit/ec7bc2bb1e58f1a45d01eec0f308bc0f86479050) Thanks [@joaquim-verges](https://github.com/joaquim-verges)! - client id optional

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
