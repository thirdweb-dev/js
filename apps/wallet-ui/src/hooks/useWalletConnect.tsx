import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useActiveWallet } from "thirdweb/react";
import {
  createWalletConnectClient,
  createWalletConnectSession,
} from "thirdweb/wallets";

export function useWalletConnect({ uri }: { uri?: string }) {
  const wallet = useActiveWallet();

  useQuery({
    queryKey: ["wallet-connect", uri],
    queryFn: async () => {
      if (!wallet || !uri) throw new Error("Unreachable");
      const wcClient = await createWalletConnectClient({
        wallet: wallet,
        client: client,
      });

      createWalletConnectSession({
        walletConnectClient: wcClient,
        uri,
      });

      toast.success("Wallet connected.", {
        id: "wallet-connect",
        icon: <CheckIcon className="h-4 w-4" />,
        duration: 5000,
      });

      return true;
    },
    enabled: !!uri || !!wallet,
  });

  return;
}
