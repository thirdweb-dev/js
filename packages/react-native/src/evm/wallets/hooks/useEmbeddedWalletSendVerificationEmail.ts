import { useWalletContext } from "@thirdweb-dev/react-core";
import { useCallback } from "react";
import { EmbeddedWallet } from "../wallets/embedded/EmbeddedWallet";

export const useEmbeddedWalletSendVerificationEmail = () => {
  const context = useWalletContext();

  const sendVerificationEmail = useCallback(
    async (email: string) => {
      if (!context.clientId) {
        throw new Error("Please, provide a clientId in the ThirdwebProvider");
      }
      return EmbeddedWallet.sendVerificationEmail({
        email,
        clientId: context.clientId,
      });
    },
    [context.clientId],
  );

  return sendVerificationEmail;
};
