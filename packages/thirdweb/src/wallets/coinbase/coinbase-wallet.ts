/**
 * internal helper functions
 */

import type { ProviderInterface } from "@coinbase/wallet-sdk";
import { trackConnect } from "../../analytics/track.js";
import type { Chain } from "../../chains/types.js";
import { COINBASE } from "../constants.js";
import type { Account, Wallet } from "../interfaces/wallet.js";
import { createWalletEmitter } from "../wallet-emitter.js";
import type { CreateWalletArgs } from "../wallet-types.js";

/**
 * @internal
 */
export function coinbaseWalletSDK(args: {
  createOptions?: CreateWalletArgs<typeof COINBASE>[1];
  providerFactory: () => Promise<ProviderInterface>;
  onConnectRequested?: (provider: ProviderInterface) => Promise<void>;
}): Wallet<typeof COINBASE> {
  const { createOptions } = args;
  const emitter = createWalletEmitter<typeof COINBASE>();
  let account: Account | undefined = undefined;
  let chain: Chain | undefined = undefined;

  function reset() {
    account = undefined;
    chain = undefined;
  }

  let handleDisconnect = async () => {};

  let handleSwitchChain = async (newChain: Chain) => {
    chain = newChain;
  };

  const unsubscribeChainChanged = emitter.subscribe(
    "chainChanged",
    (newChain) => {
      chain = newChain;
    },
  );

  const unsubscribeDisconnect = emitter.subscribe("disconnect", () => {
    reset();
    unsubscribeChainChanged();
    unsubscribeDisconnect();
  });

  emitter.subscribe("accountChanged", (_account) => {
    account = _account;
  });

  return {
    id: COINBASE,
    subscribe: emitter.subscribe,
    getChain: () => chain,
    getConfig: () => createOptions,
    getAccount: () => account,
    autoConnect: async (options) => {
      const { autoConnectCoinbaseWalletSDK } = await import(
        "./coinbaseWebSDK.js"
      );
      const provider = await args.providerFactory();
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await autoConnectCoinbaseWalletSDK(options, emitter, provider);
      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: COINBASE,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    connect: async (options) => {
      const { connectCoinbaseWalletSDK } = await import("./coinbaseWebSDK.js");
      const provider = await args.providerFactory();
      const [connectedAccount, connectedChain, doDisconnect, doSwitchChain] =
        await connectCoinbaseWalletSDK(options, emitter, provider);

      // set the states
      account = connectedAccount;
      chain = connectedChain;
      handleDisconnect = doDisconnect;
      handleSwitchChain = doSwitchChain;
      trackConnect({
        client: options.client,
        walletType: COINBASE,
        walletAddress: account.address,
      });
      // return account
      return account;
    },
    disconnect: async () => {
      reset();
      await handleDisconnect();
    },
    switchChain: async (newChain) => {
      await handleSwitchChain(newChain);
    },
    onConnectRequested: async () => {
      if (args.onConnectRequested) {
        const provider = await args.providerFactory();
        return args.onConnectRequested?.(provider);
      }
    },
  };
}
