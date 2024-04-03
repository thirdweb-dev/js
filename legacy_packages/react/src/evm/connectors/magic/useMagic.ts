import { useCallback } from "react";
import { useConnect } from "@thirdweb-dev/react-core";
import { MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets/evm/wallets/magic";
import { MagicLinkConnectOptions } from "@thirdweb-dev/wallets";

/**
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) instead
 * @walletConnection
 * @internal
 */
export function useMagic() {
  const connect = useConnect();
  return useCallback(
    async (options: MagicLinkConnectOptions & MagicLinkAdditionalOptions) => {
      const { magicLink } = await import(
        "../../../wallet/wallets/magic/magicLink"
      );
      return connect(magicLink(options), options);
    },
    [connect],
  );
}
