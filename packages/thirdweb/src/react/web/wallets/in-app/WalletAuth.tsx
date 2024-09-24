import { Suspense, useRef, useState } from "react";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useAddConnectedWallet } from "../../../core/hooks/wallets/useAddConnectedWallet.js";
import AllWalletsUI from "../../ui/ConnectWallet/Modal/AllWalletsUI.js";
import { WalletSelector } from "../../ui/ConnectWallet/WalletSelector.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { WalletImage } from "../../ui/components/WalletImage.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { getDefaultWallets } from "../defaultWallets.js";
import { ErrorState } from "../shared/ErrorState.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { LoadingState } from "../shared/LoadingState.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";

export function WalletAuth(props: {
  wallet: Wallet<"inApp" | EcosystemWalletId>;
  client: ThirdwebClient;
  done: () => void;
  size: "compact" | "wide";
  locale: ConnectLocale;
  inAppLocale: InAppWalletLocale;
  onBack: () => void;
  walletConnect: { projectId?: string } | undefined;
  meta?: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
  };
}) {
  const { wallet, done } = props;
  const addConnectedWallet = useAddConnectedWallet();
  const walletToConnect = useRef<Wallet>();
  const [status, setStatus] = useState<"loading" | "error" | "selecting">(
    "selecting",
  );
  const [error, setError] = useState<string | undefined>();
  const [showAll, setShowAll] = useState<boolean>(false);

  const back = () => {
    setStatus("selecting");
    walletToConnect.current = undefined;
    props.onBack();
  };

  async function login(walletToLink: Wallet) {
    setStatus("loading");
    walletToConnect.current = walletToLink;
    try {
      await linkProfile({
        client: props.client,
        strategy: "wallet",
        wallet: walletToLink,
        chain: wallet.getChain() || defineChain(1),
      }).catch((e) => {
        setError(e.message);
        throw e;
      });
      addConnectedWallet(walletToLink);
      done();
    } catch {
      setStatus("error");
    }
  }

  if (!walletToConnect.current) {
    if (showAll) {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <AllWalletsUI
            onBack={() => setShowAll(false)}
            onSelect={async (newWallet) => {
              login(newWallet);
              setShowAll(false);
            }}
            client={props.client}
            connectLocale={props.locale}
            recommendedWallets={undefined}
            specifiedWallets={[]}
            size={props.size}
            disableSelectionDataReset={true}
          />
        </Suspense>
      );
    }
    return (
      <WalletSelector
        title={props.locale.connectAWallet}
        wallets={getDefaultWallets()}
        selectWallet={async (newWallet) => {
          login(newWallet);
        }}
        onShowAll={() => {
          setShowAll(true);
        }}
        done={() => {}}
        goBack={back}
        setModalVisibility={() => {}}
        client={props.client}
        connectLocale={props.locale}
        hideHeader={false}
        recommendedWallets={undefined}
        chain={wallet.getChain()}
        showAllWallets={true}
        chains={[]}
        size={props.size}
        meta={props.meta || {}}
        walletConnect={props.walletConnect}
        modalHeader={{ title: props.inAppLocale.linkWallet, onBack: back }}
        walletIdsToHide={["inApp"]}
        disableSelectionDataReset={true}
      />
    );
  }

  return (
    <Container animate="fadein" fullHeight flex="column">
      <Container p="lg">
        <ModalHeader title={props.inAppLocale.linkWallet} onBack={back} />
      </Container>

      <Container
        px={props.size === "wide" ? "xxl" : "lg"}
        expand
        flex="column"
        center="y"
      >
        <div>
          {status === "error" ? (
            <>
              <ErrorState
                onTryAgain={() => {
                  if (!walletToConnect.current) {
                    throw new Error("Failed to connect to unknown wallet");
                  }
                  login(walletToConnect.current);
                }}
                title={error || "Failed to Login"}
              />
              <Spacer y="lg" />
            </>
          ) : (
            <>
              <LoadingState
                title="Sign in with your wallet"
                subtitle="A pop-up prompt will appear to sign-in and verify your wallet"
                icon={
                  <WalletImage
                    id={walletToConnect.current.id ?? ""}
                    size={iconSize.xl}
                    client={props.client}
                  />
                }
              />
            </>
          )}
        </div>
      </Container>
    </Container>
  );
}
