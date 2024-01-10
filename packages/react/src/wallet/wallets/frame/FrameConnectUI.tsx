import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { FrameWallet } from "@thirdweb-dev/wallets";
import { ConnectingScreen } from "../../ConnectWallet/screens/ConnectingScreen";
import { isMobile } from "../../../evm/utils/isMobile";
import { useEffect, useRef, useState } from "react";
import {
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../../../components/modalElements";
import { Spacer } from "../../../components/Spacer";
import { Container, ModalHeader } from "../../../components/basic";
import {
  ButtonLink,
  GetStartedScreen,
} from "../../ConnectWallet/screens/GetStartedScreen";
import { Img } from "../../../components/Img";
import { iconSize } from "../../../design-system";
import { openWindow } from "../../utils/openWindow";
import { useTWLocale } from "../../../evm/providers/locale-provider";

const FrameFailedConnect: React.FC<{
  onBack: () => void;
  walletIconURL: string;
  supportLink: string;
}> = (props) => {
  const locale = useTWLocale().wallets.frameWallet.connectionFailedScreen;

  return (
    <Container p="lg">
      <ModalHeader onBack={() => props.onBack()} title="Frame" />
      <Spacer y="xl" />
      {
        <>
          <ModalTitle> {locale.title} </ModalTitle>
          <Spacer y="sm" />
          <ModalDescription>{locale.description}</ModalDescription>
        </>
      }
      <Spacer y="lg" />
      <ButtonLink
        onClick={() => {
          openWindow("https://frame.sh");
        }}
      >
        <Img
          width={iconSize.lg}
          height={iconSize.lg}
          src={props.walletIconURL}
        />
        <span>{locale.downloadFrame}</span>
      </ButtonLink>
      <Spacer y="lg" />
      <HelperLink target="_blank" href={props.supportLink}>
        {locale.supportLink}
      </HelperLink>
    </Container>
  );
};

export const FrameConnectUI = (props: ConnectUIProps<FrameWallet>) => {
  const [screen, setScreen] = useState<
    "connecting" | "connect-failed" | "get-started"
  >("connecting");
  const locale = useTWLocale().wallets.frameWallet;

  const { connect } = props;
  const connectPrompted = useRef(false);
  const { walletConfig, connected, goBack } = props;
  const downloadLink = "https://frame.sh";
  const supportLink = "https://docs.frame.sh";
  const hideBackButton = props.supportedWallets.length === 1;

  useEffect(() => {
    if (connectPrompted.current) {
      return;
    }

    // if loading
    (async () => {
      // if not mobile we connect
      if (!isMobile()) {
        try {
          connectPrompted.current = true;
          setScreen("connecting");
          await connect();
          connected();
        } catch (e) {
          setScreen("connect-failed");
        }
      }

      // on mobile we open the website
      else if (isMobile()) {
        openWindow(downloadLink);
      }
    })();
  }, [connect, goBack, connected]);

  if (screen === "connecting") {
    return (
      <ConnectingScreen
        locale={{
          getStartedLink: locale.getStartedLink,
          instruction: locale.connectionScreen.instruction,
          tryAgain: locale.connectionScreen.retry,
          inProgress: locale.connectionScreen.inProgress,
          failed: locale.connectionScreen.failed,
        }}
        errorConnecting={false}
        onRetry={() => {
          // NOOP
        }}
        onGetStarted={() => {
          setScreen("get-started");
        }}
        hideBackButton={hideBackButton}
        onBack={goBack}
        walletName={walletConfig.meta.name}
        walletIconURL={walletConfig.meta.iconURL}
      />
    );
  }

  if (screen === "connect-failed") {
    return (
      <FrameFailedConnect
        onBack={goBack}
        walletIconURL={walletConfig.meta.iconURL}
        supportLink={supportLink}
      />
    );
  }

  if (screen === "get-started") {
    return (
      <GetStartedScreen
        locale={{
          scanToDownload: locale.getStartedScreen.instruction,
        }}
        walletIconURL={walletConfig.meta.iconURL}
        walletName={walletConfig.meta.name}
        chromeExtensionLink={walletConfig.meta.urls?.chrome}
        googlePlayStoreLink={walletConfig.meta.urls?.android}
        appleStoreLink={walletConfig.meta.urls?.ios}
        onBack={props.goBack}
      />
    );
  }

  return null;
};
