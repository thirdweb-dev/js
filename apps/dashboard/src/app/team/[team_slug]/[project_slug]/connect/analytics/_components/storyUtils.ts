import type { WalletStats } from "@3rdweb-sdk/react/hooks/useApi";
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
];

const pickRandomWallet = () => {
  return walletsToPickFrom[
    Math.floor(Math.random() * walletsToPickFrom.length)
  ];
};

export function createWalletStatsStub(days: number): WalletStats {
  const timeSeries: WalletStats["timeSeries"] = [];

  let d = days;
  while (d !== 0) {
    const uniqueWallets = Math.floor(Math.random() * 100);
    timeSeries.push({
      clientId: "",
      dayTime: new Date(2024, 1, d).toISOString(),
      totalWallets: uniqueWallets + Math.floor(Math.random() * 100),
      uniqueWallets: uniqueWallets,
      walletType: pickRandomWallet(),
    });

    if (Math.random() > 0.7) {
      d--;
    }
  }

  return {
    timeSeries,
  };
}
