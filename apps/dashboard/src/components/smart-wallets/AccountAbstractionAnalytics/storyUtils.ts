import type { UserOpStats } from "types/analytics";

export function createUserOpStatsStub(days: number): UserOpStats[] {
  const stubbedData: UserOpStats[] = [];

  let d = days;
  while (d !== 0) {
    const successful = Math.floor(Math.random() * 100);
    const failed = Math.floor(Math.random() * 100);
    const sponsoredUsd = Math.floor(Math.random() * 100);
    stubbedData.push({
      date: new Date(2024, 1, d).toLocaleString(),
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
