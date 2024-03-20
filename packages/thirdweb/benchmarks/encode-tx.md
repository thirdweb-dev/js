## Encode TX Benchmark Results ([benchmark code](./encode-tx.ts))

The RPC benchmark measures encoding an ERC20 `transfer` call.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### encode transfer (warm cache)

| Library  | Time (avg)     | Min … Max            | P75       | P99       | P999     |
| -------- | -------------- | -------------------- | --------- | --------- | -------- |
| thirdweb | 1'494 ns/iter  | 1'337 ns … 2'585 ns  | 1'526 ns  | 2'065 ns  | 2'585 ns |
| ethers   | 32'450 ns/iter | 27'083 ns … 1'102 µs | 32'125 ns | 53'709 ns | 542 µs   |
| viem     | 1'170 ns/iter  | 1'057 ns … 1'731 ns  | 1'162 ns  | 1'559 ns  | 1'731 ns |

**Summary for encode transfer (warm cache):**

- **thirdweb** is 21.72x faster than ethers.
- **viem** is 1.28x faster than thirdweb and 27.75x faster than ethers.

### encode transfer (cold cache)

| Library  | Time (avg)     | Min … Max            | P75       | P99       | P999     |
| -------- | -------------- | -------------------- | --------- | --------- | -------- |
| thirdweb | 1'691 ns/iter  | 1'532 ns … 2'226 ns  | 1'709 ns  | 2'131 ns  | 2'226 ns |
| ethers   | 41'674 ns/iter | 34'833 ns … 1'267 µs | 41'416 ns | 63'500 ns | 882 µs   |
| viem     | 1'205 ns/iter  | 1'073 ns … 1'803 ns  | 1'214 ns  | 1'661 ns  | 1'803 ns |

**Summary for encode transfer (cold cache):**

- **thirdweb** is 24.64x faster than ethers.
- **viem** is 1.4x faster than thirdweb and 34.58x faster than ethers.

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
