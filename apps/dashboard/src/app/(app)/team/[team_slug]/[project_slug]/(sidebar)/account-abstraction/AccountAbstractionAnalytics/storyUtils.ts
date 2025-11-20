import type { UserOpStats } from "@/types/analytics";

export function createUserOpStatsStub(days: number): UserOpStats[] {
  const stubbedData: UserOpStats[] = [];

  let d = days;
  while (d !== 0) {
    // don't use Math.floor because real data doesn't not have integer values
    const successful = Math.random() * 100;
    const failed = Math.random() * 100;
    const sponsoredUsd = Math.random() * 100;
    const gasUnits = Math.random() * 1000000; // Random gas units between 0-1M
    const avgGasPrice = Math.random() * 100000000000; // Random gas price in wei (0-100 Gwei)

    stubbedData.push({
      chainId: Math.floor(Math.random() * 100).toString(),
      date: new Date(2024, 11, d).toLocaleString(),
      failed,
      sponsoredUsd,
      successful,
      gasUnits,
      avgGasPrice,
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
