import { useConnect, useWallet } from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { useCallback, useEffect, useState } from "react";

export function usePaperWallet() {
  const connect = useConnect();
  return useCallback(
    async (options: { chainId?: number; clientId: string }) => {
      const { paperWallet } = await import(
        "../../../wallet/wallets/paperWallet"
      );
      connect(paperWallet({ clientId: options?.clientId }), options);
    },
    [connect],
  );
}

export function usePaperWalletUserEmail() {
  const wallet = useWallet();
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (wallet?.walletId !== "PaperWallet") {
      setEmail(undefined);
      return;
    }
    (wallet as PaperWallet).getEmail().then((_email) => {
      setEmail(_email);
    });
  }, [wallet]);

  return email;
}
