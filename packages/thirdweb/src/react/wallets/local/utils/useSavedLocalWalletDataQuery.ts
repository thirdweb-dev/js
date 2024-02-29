import { useQuery } from "@tanstack/react-query";
import { LocalWallet } from "../../../../wallets/local/index.js";

/**
 * Fetch the saved local wallet data from localStorage.
 * @internal
 */
export function useSavedLocalWalletDataQuery() {
  return useQuery({
    queryKey: ["localWalletData"],
    queryFn: async () => {
      const data = await LocalWallet.getSavedData();
      if (data?.isEncrypted && data.type === "privateKey") {
        return data;
      }
      return null;
    },
  });
}
