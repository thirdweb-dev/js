import {
  type WalletConfig,
  WalletInstance,
  useCreateWalletInstance,
  useSetConnectedWallet,
  useSetConnectionStatus,
  useWalletContext,
} from "@thirdweb-dev/react-core";
import type { SmartWalletConfigOptions } from "../../../wallet/wallets/smartWallet/types";
import {
  getSmartWalletAddress,
  type SmartWalletConnectionArgs,
} from "@thirdweb-dev/wallets/evm/wallets/smart-wallet";
import { useCallback } from "react";
import type { BytesLike } from "ethers";

export function useSmartWallet<W extends WalletInstance>(
  personalWallet: WalletConfig<W>,
  options: SmartWalletConfigOptions,
) {
  const create = useCreateWalletInstance();
  const setStatus = useSetConnectionStatus();
  const setWallet = useSetConnectedWallet();
  const context = useWalletContext();

  const predictAddress = useCallback(
    async (args: { personalWalletAddress: string; data?: BytesLike }) => {
      return getSmartWalletAddress(
        context.activeChain,
        options.factoryAddress,
        args.personalWalletAddress,
        args.data,
      );
    },
    [context.activeChain, options.factoryAddress],
  );

  const connect = useCallback(
    async (args?: {
      connectPersonalWallet?: (wallet: W) => Promise<void>;
      connectionArgs?: Omit<SmartWalletConnectionArgs, "personalWallet">;
    }) => {
      const { smartWallet } = await import(
        "../../../wallet/wallets/smartWallet/smartWallet"
      );
      setStatus("connecting");
      const pw = create(personalWallet);
      const sw = create(smartWallet(personalWallet, options));
      try {
        if (args?.connectPersonalWallet) {
          // if passed in, use custom function to connect personal wallet
          await args.connectPersonalWallet(pw);
        } else {
          // otherwise default to auto-connecting personal wallet with chainId
          await pw.connect({
            chainId: context.activeChain.chainId,
          });
        }
        await sw.connect({
          ...args?.connectionArgs,
          personalWallet: pw,
        });
        setStatus("connected");
        setWallet(sw);
      } catch (e) {
        console.error("Error connecting to smart wallet", e);
        setStatus("disconnected");
      }
      return sw;
    },
    [
      context.activeChain.chainId,
      create,
      options,
      personalWallet,
      setStatus,
      setWallet,
    ],
  );
  return {
    connect,
    predictAddress,
  };
}
