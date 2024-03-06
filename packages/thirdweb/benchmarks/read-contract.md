## Read Contract Benchmark Results ([benchmark code](./read-contract.ts))

The read contract benchmark measures reading the `balanceOf` method of an ERC20 contract (USDC).

**CPU:** Apple M1 Pro  
**Runtime:** bun 1.0.30 (arm64-darwin)

### read contract (warm cache)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 189 µs/iter   | 137 µs … 1'149 µs   | 200 µs   | 492 µs   | 903 µs   |
| viem     | 206 µs/iter   | 140 µs … 1'367 µs   | 216 µs   | 753 µs   | 1'254 µs |
| ethers   | 2'895 µs/iter | 1'728 µs … 7'578 µs | 3'294 µs | 7'066 µs | 7'578 µs |

**Summary for read contract (warm cache):**

- **thirdweb** is 1.09x faster than viem and 15.29x faster than ethers.

### read contract (cold cache)

| Library  | Time (avg)    | Min … Max           | P75      | P99      | P999     |
| -------- | ------------- | ------------------- | -------- | -------- | -------- |
| thirdweb | 186 µs/iter   | 137 µs … 1'171 µs   | 194 µs   | 455 µs   | 1'087 µs |
| viem     | 200 µs/iter   | 151 µs … 1'069 µs   | 208 µs   | 775 µs   | 942 µs   |
| ethers   | 2'540 µs/iter | 1'588 µs … 8'099 µs | 2'871 µs | 6'978 µs | 8'099 µs |

**Summary for read contract (cold cache):**

- **thirdweb** is 1.08x faster than viem and 13.66x faster than ethers.

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
