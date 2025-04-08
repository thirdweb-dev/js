import { THIRDWEB_VAULT_URL } from "@/constants/env";
import { createVaultClient, listEoas } from "@thirdweb-dev/vault-sdk";

export default async function TransactionsServerWalletsPage() {
  const vaultClient = await createVaultClient({
    baseUrl: THIRDWEB_VAULT_URL,
  });

  console.log(vaultClient);

  const eoas = await listEoas({
    client: vaultClient,
    request: {
      auth: {
        adminKey:
          "sa_adm_UHST_NIWG_AR5B_VLWM_LBLS_OQFT_793e1701-9a96-4625-9f53-35a8c41d7068",
      },
      options: {
        page: 1,
        pageSize: 10,
      },
    },
  }).catch((e) => console.log(e));

  console.log(eoas);

  return <div>Server Wallets {JSON.stringify(eoas, null, 4)}</div>;
}
