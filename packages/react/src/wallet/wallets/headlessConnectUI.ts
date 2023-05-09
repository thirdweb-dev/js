import {
  ConfiguredWallet,
  ConnectUIProps,
  useConnect,
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
        open();
        console.error(e);
      }
    })();
  }, [configuredWallet, connect, close, open]);

  return null;
};
