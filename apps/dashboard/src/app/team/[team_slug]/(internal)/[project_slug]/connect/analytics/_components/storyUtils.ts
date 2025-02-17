import type { WalletId } from "thirdweb/wallets";
import type { WalletStats } from "types/analytics";

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
