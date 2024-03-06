## Send Transaction Benchmark Results ([benchmark code](./send-transaction.ts))

The send transaction benchmark measures sending native tokens (ETH) to another address.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### transfer native tokens

| Library  | Time (avg)     | Min … Max             | P75       | P99       | P999      |
| -------- | -------------- | --------------------- | --------- | --------- | --------- |
| thirdweb | 5'167 µs/iter  | 2'875 µs … 11'247 µs  | 6'367 µs  | 9'769 µs  | 11'247 µs |
| viem     | 6'819 µs/iter  | 5'072 µs … 11'107 µs  | 7'895 µs  | 11'107 µs | 11'107 µs |
| ethers   | 26'362 µs/iter | 19'826 µs … 37'974 µs | 29'293 µs | 37'974 µs | 37'974 µs |

**Summary for transfer native tokens:**

- **thirdweb** is 1.32x faster than viem and 5.1x faster than ethers.

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
