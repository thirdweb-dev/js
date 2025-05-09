import { getConfiguredThirdwebClient } from "./thirdweb.server";

export function getClientThirdwebClient(params?: {
  jwt: string | undefined | null;
  teamId: string | undefined | null;
}) {
  return getConfiguredThirdwebClient({
    secretKey: params?.jwt ?? undefined,
    teamId: params?.teamId ?? undefined,
  });
}
