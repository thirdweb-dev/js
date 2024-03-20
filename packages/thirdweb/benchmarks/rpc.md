## RPC Benchmark Results ([benchmark code](./rpc.ts))

The RPC benchmark measures un-cached calls to a local anvil node using the `eth_getBlockNumber` method.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### rpc (batching disabled)

| Library  | Time (avg)     | Min … Max            | P75       | P99      | P999     |
| -------- | -------------- | -------------------- | --------- | -------- | -------- |
| thirdweb | 72'167 ns/iter | 47'625 ns … 1'197 µs | 76'292 ns | 146 µs   | 850 µs   |
| viem     | 80'414 ns/iter | 52'541 ns … 937 µs   | 85'333 ns | 169 µs   | 705 µs   |
| ethers   | 1'655 µs/iter  | 1'254 µs … 6'840 µs  | 1'616 µs  | 4'851 µs | 6'840 µs |

**Summary for rpc (batching disabled):**

- **thirdweb** is 1.11x faster than viem and 22.93x faster than ethers.

### rpc (batching enabled)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 1'579 µs/iter | 1'214 µs … 5'993 µs | 1'471 µs | 5'058 µs | 5'993 µs |
| viem     | 1'641 µs/iter | 1'259 µs … 6'309 µs | 1'503 µs | 5'852 µs | 6'309 µs |
| ethers   | 1'864 µs/iter | 1'255 µs … 6'225 µs | 1'746 µs | 5'923 µs | 6'225 µs |

**Summary for rpc (batching enabled):**

- **thirdweb** is 1.04x faster than viem and 1.18x faster than ethers.

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
