# Comparitive Benchmarks

We aim to compare real-world use-cases of the thirdweb library with other popular libraries in the Ethereum ecosystem.

## Bundle size

Imported bundle size to make a basic RPC call:

- thirdweb: 4.63 KB gzipped
  - `import { createThirdwebClient, getRpcClient, defineChain }`
- viem: 3.78 KB gzipped
  - `import { createClient, http }`
- ethers: 88 KB gzipped
  - `import { getJsonRPCProvider }`

## Benchmarks

_Latest results are from the `beta` branch on March 20th, 2024._

- [Encode TX Benchmark Results](./encode-tx.md)
- [RPC Benchmark Results](./rpc.md)
- [Read Contract Benchmark Results](./read-contract.md)
- [Send Transaction Benchmark Results](./send-transaction.md)

## Running benchmarks

You can run these benchmarks yourself by cloning the repository and running the following commands:

```bash
# install dependencies
pnpm i
# cd into the thirdweb package
cd packages/thirdweb
# run the benchmark
pnpm run bench:compare
```

Please note that you need to have the following prerequisites installed in order to run the benchmarks:

- `bun` (https://bun.sh)
- `anvil` (https://book.getfoundry.sh/getting-started/installation)

## Reporting issues / inconsistencies

Please report any issues or inconsistencies you encounter while running the benchmarks in the [issues](https://github.com/thirdweb-dev/js/issues/new).
