import {
  ConfiguredWallet,
  ConnectUIProps,
  useConnect,
  useWallets,
} from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";

type HeadlessConnectUIProps = ConnectUIProps & {
  configuredWallet: ConfiguredWallet;
};

export const HeadlessConnectUI = ({
  close,
  configuredWallet,
  open,
}: HeadlessConnectUIProps) => {
  const connect = useConnect();
  const prompted = useRef(false);
  const singleWallet = useWallets().length === 1;

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;

    (async () => {
      close();
      try {
        await connect(configuredWallet);
      } catch (e) {
        if (!singleWallet) {
          open();
        }
        console.error(e);
      }
    })();
  }, [configuredWallet, connect, close, open, singleWallet]);

  return null;
};
