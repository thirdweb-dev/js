import { ConnectUIProps, useConnect } from "@thirdweb-dev/react-core";
import { useEffect, useRef } from "react";
import { Container } from "../../components/basic";
import { Spinner } from "../../components/Spinner";

export const HeadlessConnectUI = ({
  connected,
  walletConfig,
  hide,
  show,
  supportedWallets,
  goBack,
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
      hide();
      try {
        await connect(walletConfig);
        connected();
      } catch (e) {
        if (!singleWallet) {
          goBack();
          show();
        }
        console.error(e);
      }
    })();
  }, [walletConfig, connect, singleWallet, connected, hide, show, goBack]);

  return (
    <Container
      flex="row"
      center="both"
      style={{
        minHeight: "250px",
      }}
      p="lg"
    >
      <Spinner size="lg" color="accentText" />
    </Container>
  );
};
