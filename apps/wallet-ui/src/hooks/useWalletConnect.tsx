import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useActiveWallet } from "thirdweb/react";
import {
  createWalletConnectClient,
  createWalletConnectSession,
} from "thirdweb/wallets";
import { client } from "@/lib/client";

export function useWalletConnect({ uri }: { uri?: string }) {
  const wallet = useActiveWallet();

  useQuery({
    enabled: !!uri || !!wallet,
    queryFn: async () => {
      if (!wallet || !uri) throw new Error("Unreachable");
      const wcClient = await createWalletConnectClient({
        client: client,
        wallet: wallet,
      });

      createWalletConnectSession({
        uri,
        walletConnectClient: wcClient,
      });

      toast.success("Wallet connected.", {
        duration: 5000,
        icon: <CheckIcon className="h-4 w-4" />,
        id: "wallet-connect",
      });

      return true;
    },
    queryKey: ["wallet-connect", uri],
  });

  return;
}
