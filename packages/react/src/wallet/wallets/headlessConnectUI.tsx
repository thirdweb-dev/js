import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Flex } from "../../components/basic";
import { Spinner } from "../../components/Spinner";

export const HeadlessConnectUI = ({
  close,
  walletConfig,
  open,
  supportedWallets,
}: ConnectUIProps<any>) => {
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

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: "250px",
      }}
    >
      <Spinner size="md" color="primaryText" />
    </Flex>
  );
};
