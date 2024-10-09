import { getApiKeys } from "../../../../api/lib/getAPIKeys";

export async function getAASupportedAPIKeys() {
  return (await getApiKeys()).filter((key) => {
    return !!(key.services || []).find((srv) => srv.name === "bundler");
  });
}
