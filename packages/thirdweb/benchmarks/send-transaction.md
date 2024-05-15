## Send Transaction Benchmark Results ([benchmark code](./send-transaction.ts))

The send transaction benchmark measures sending native tokens (ETH) to another address.

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### transfer native tokens

| Library  | Time (avg)     | Min … Max             | P75       | P99       | P999      |
| -------- | -------------- | --------------------- | --------- | --------- | --------- |
| thirdweb | 3'244 µs/iter  | 1'879 µs … 5'580 µs   | 3'958 µs  | 5'543 µs  | 5'580 µs  |
| viem     | 7'468 µs/iter  | 6'224 µs … 10'241 µs  | 8'077 µs  | 10'241 µs | 10'241 µs |
| ethers   | 18'376 µs/iter | 17'534 µs … 20'136 µs | 19'084 µs | 20'136 µs | 20'136 µs |

**Summary for Transfer Native Tokens:**

- **thirdweb** is 2.3x faster than viem and 5.67x faster than ethers.

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
