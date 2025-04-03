import type { UserOpStats } from "types/analytics";

export function createUserOpStatsStub(days: number): UserOpStats[] {
  const stubbedData: UserOpStats[] = [];

  let d = days;
  while (d !== 0) {
    // don't use Math.floor because real data doesn't not have integer values
    const successful = Math.random() * 100;
    const failed = Math.random() * 100;
    const sponsoredUsd = Math.random() * 100;

    stubbedData.push({
      date: new Date(2024, 11, d).toLocaleString(),
      successful,
      failed,
      sponsoredUsd,
      chainId: Math.floor(Math.random() * 100).toString(),
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
