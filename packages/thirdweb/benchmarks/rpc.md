## RPC Benchmark Results ([benchmark code](./rpc.ts))

The RPC benchmark measures un-cached calls to a local anvil node using the `eth_getBlockNumber` method.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### rpc (batching disabled)

| Library  | Time (avg)     | Min … Max            | P75       | P99      | P999      |
| -------- | -------------- | -------------------- | --------- | -------- | --------- |
| thirdweb | 74'172 ns/iter | 44'917 ns … 831 µs   | 79'667 ns | 164 µs   | 643 µs    |
| viem     | 81'014 ns/iter | 52'750 ns … 815 µs   | 88'459 ns | 140 µs   | 683 µs    |
| ethers   | 2'109 µs/iter  | 1'390 µs … 10'204 µs | 2'071 µs  | 6'454 µs | 10'204 µs |

**Summary for rpc (batching disabled):**

- **thirdweb** is 1.09x faster than viem and 28.43x faster than ethers.

### rpc (batching enabled)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 1'691 µs/iter | 1'268 µs … 7'927 µs | 1'578 µs | 5'136 µs | 7'927 µs |
| viem     | 1'987 µs/iter | 1'328 µs … 9'375 µs | 1'816 µs | 8'577 µs | 9'375 µs |
| ethers   | 2'232 µs/iter | 1'430 µs … 8'592 µs | 2'176 µs | 6'927 µs | 8'592 µs |

**Summary for rpc (batching enabled):**

- **thirdweb** is 1.17x faster than viem and 1.32x faster than ethers.

### Running benchmarks

To run the benchmarks, clone the repository and run the following commands:

```bash
# install dependencies
pnpm i
# cd into the thirdweb package
cd packages/thirdweb
# run the benchmark
pnpm run bench:compare
```

**Prerequisites:**

- `bun` installed (https://bun.sh)
- `anvil` installed (https://book.getfoundry.sh/getting-started/installation)
