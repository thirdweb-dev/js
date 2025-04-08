import type { Wallet } from "./types";
import { ServerWalletsTableUI } from "./wallet-table-ui";

export function ServerWalletsTable({ wallets }: { wallets: Wallet[] }) {
  return <ServerWalletsTableUI wallets={wallets} />;
}
