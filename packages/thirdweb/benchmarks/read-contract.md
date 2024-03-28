## Read Contract Benchmark Results ([benchmark code](./read-contract.ts))

The read contract benchmark measures reading the `balanceOf` method of an ERC20 contract (USDC).

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### read contract (warm cache)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 203 µs/iter   | 149 µs … 1'436 µs   | 199 µs   | 711 µs   | 1'370 µs |
| viem     | 208 µs/iter   | 163 µs … 1'341 µs   | 206 µs   | 742 µs   | 1'283 µs |
| ethers   | 2'118 µs/iter | 1'577 µs … 4'454 µs | 2'058 µs | 4'338 µs | 4'454 µs |

**Summary for read contract (warm cache):**

- **thirdweb** is 1.02x faster than viem and 10.43x faster than ethers.

### read contract (cold cache)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 191 µs/iter   | 149 µs … 1'195 µs   | 189 µs   | 747 µs   | 1'130 µs |
| viem     | 211 µs/iter   | 162 µs … 1'290 µs   | 209 µs   | 825 µs   | 1'038 µs |
| ethers   | 1'764 µs/iter | 1'441 µs … 3'829 µs | 1'731 µs | 3'420 µs | 3'829 µs |

**Summary for read contract (cold cache):**

- **thirdweb** is 1.1x faster than viem and 9.22x faster than ethers.

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
