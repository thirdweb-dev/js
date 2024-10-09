import { getApiKeys } from "../../../../api/lib/getAPIKeys";

export async function getInAppWalletSupportedAPIKeys() {
  return (await getApiKeys()).filter((key) => {
    return !!(key.services || []).find((srv) => srv.name === "embeddedWallets");
  });
}
