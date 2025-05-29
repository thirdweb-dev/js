# @thirdweb-dev/insight

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
