import type { UserOpStats, WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import type { WalletId } from "thirdweb/wallets";

const walletsToPickFrom: WalletId[] = [
  "io.metamask",
  "com.binance",
  "com.coinbase.wallet",
  "io.zerion.wallet",
  "me.rainbow",
  "com.trustwallet.app",
  "com.zengo",
  "xyz.argent",
  "com.exodus",
  "app.phantom",
  "com.okex.wallet",
  "io.clingon",
  "com.broearn",
  "com.coinomi",
  "com.ripio",
  "com.sabay.wallet",
  "io.tokoin",
  "world.fncy",
  "io.copiosa",
];

const pickRandomWallet = () => {
  return (
    walletsToPickFrom[Math.floor(Math.random() * walletsToPickFrom.length)] ||
    "io.metamask"
  );
};

export function createWalletStatsStub(days: number): WalletStats[] {
  const stubbedData: WalletStats[] = [];

  let d = days;
  while (d !== 0) {
    const uniqueWallets = Math.floor(Math.random() * 100);
    stubbedData.push({
      date: new Date(2024, 1, d).toLocaleString(),
      totalConnections: uniqueWallets + Math.floor(Math.random() * 100),
      uniqueWalletsConnected: uniqueWallets,
      walletType: pickRandomWallet(),
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}

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
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return stubbedData;
}
