import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";
import type { Wallet } from "./wallet-table/types.js";
import { ServerWalletsTable } from "./wallet-table/wallet-table";

export default async function TransactionsServerWalletsPage() {
  const vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  });

  const eoas = await listEoas({
    client: vaultClient,
    request: {
      auth: {
        adminKey:
          "sa_adm_UHST_NIWG_AR5B_VLWM_LBLS_OQFT_793e1701-9a96-4625-9f53-35a8c41d7068",
      },
      options: {},
    },
  });

  if (!eoas.success) {
    return <div>Error: {eoas.error.message}</div>;
  }

  return <ServerWalletsTable wallets={eoas.data.items as Wallet[]} />;
}
