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
  hideModal,
  showModal,
  onConnect: closeModal,
  configuredWallet,
}: HeadlessConnectUIProps) => {
  const connect = useConnect();
  const prompted = useRef(false);

  useEffect(() => {
    if (prompted.current) {
      return;
    }
    prompted.current = true;

    (async () => {
      try {
        hideModal();
        await connect(configuredWallet);
        closeModal();
      } catch (e) {
        closeModal();
        console.error(e);
      }
    })();
  }, [closeModal, configuredWallet, hideModal, showModal, connect]);

  return null;
};
