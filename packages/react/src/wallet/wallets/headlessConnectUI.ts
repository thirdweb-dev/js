import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";

export const HeadlessConnectUI = ({
  close,
  walletConfig,
  open,
  supportedWallets,
}: ConnectUIProps) => {
  const connect = useConnect();
  const prompted = useRef(false);
  const singleWallet = supportedWallets.length === 1;

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;

    (async () => {
      close();
      try {
        await connect(walletConfig);
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [walletConfig, connect, close, open, singleWallet]);

  return null;
};
