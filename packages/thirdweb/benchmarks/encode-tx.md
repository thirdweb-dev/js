## Encode TX Benchmark Results ([benchmark code](./encode-tx.ts))

The RPC benchmark measures encoding an ERC20 `transfer` call.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### encode transfer (warm cache)

| Library  | Time (avg)     | Min … Max            | P75       | P99       | P999      |
| -------- | -------------- | -------------------- | --------- | --------- | --------- |
| thirdweb | 2'199 ns/iter  | 1'969 ns … 4'085 ns  | 2'338 ns  | 3'242 ns  | 4'085 ns  |
| ethers   | 32'311 ns/iter | 27'250 ns … 1'134 µs | 31'334 ns | 60'667 ns | 173 µs    |
| viem     | 7'545 ns/iter  | 6'208 ns … 1'248 µs  | 7'292 ns  | 22'166 ns | 46'959 ns |

**Summary for encode transfer (warm cache):**

- **thirdweb** is 3.43x faster than viem and 14.7x faster than ethers.

### encode transfer (cold cache)

| Library  | Time (avg)     | Min … Max           | P75       | P99       | P999     |
| -------- | -------------- | ------------------- | --------- | --------- | -------- |
| thirdweb | 2'366 ns/iter  | 2'166 ns … 2'890 ns | 2'525 ns  | 2'793 ns  | 2'890 ns |
| ethers   | 41'347 ns/iter | 34'875 ns … 960 µs  | 40'167 ns | 75'959 ns | 805 µs   |
| viem     | 7'444 ns/iter  | 6'990 ns … 8'407 ns | 7'679 ns  | 8'273 ns  | 8'407 ns |

**Summary for encode transfer (cold cache):**

- **thirdweb** is 3.15x faster than viem and 17.47x faster than ethers.

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
