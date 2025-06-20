import { Suspense, useRef, useState } from "react";
import type { Chain } from "../../../../chains/types.js";
import { defineChain } from "../../../../chains/utils.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { getDefaultWallets } from "../../../../wallets/defaultWallets.js";
import { isEcosystemWallet } from "../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import { linkProfile } from "../../../../wallets/in-app/web/lib/auth/index.js";
import type { Wallet } from "../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../wallets/wallet-types.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useAddConnectedWallet } from "../../../core/hooks/wallets/useAddConnectedWallet.js";
import type { ConnectLocale } from "../../ui/ConnectWallet/locale/types.js";
import AllWalletsUI from "../../ui/ConnectWallet/Modal/AllWalletsUI.js";
import { WalletSelector } from "../../ui/ConnectWallet/WalletSelector.js";
import { Container, ModalHeader } from "../../ui/components/basic.js";
import { Spacer } from "../../ui/components/Spacer.js";
import { WalletImage } from "../../ui/components/WalletImage.js";
import { ErrorState } from "../shared/ErrorState.js";
import { LoadingScreen } from "../shared/LoadingScreen.js";
import { LoadingState } from "../shared/LoadingState.js";
import type { InAppWalletLocale } from "../shared/locale/types.js";

export function WalletAuth(props: {
  wallet: Wallet<"inApp" | EcosystemWalletId>;
  chain: Chain | undefined;
  client: ThirdwebClient;
  done: () => void;
  size: "compact" | "wide";
  locale: ConnectLocale;
  inAppLocale: InAppWalletLocale;
  onBack: () => void;
  walletConnect: { projectId?: string } | undefined;
  isLinking: boolean;
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
  const walletToConnect = useRef<Wallet>(undefined);
  const [status, setStatus] = useState<"loading" | "error" | "selecting">(
    "selecting",
  );
  const [error, setError] = useState<string | undefined>();
  const [showAll, setShowAll] = useState<boolean>(false);
  const ecosystem = isEcosystemWallet(wallet)
    ? {
        id: wallet.id,
        partnerId: wallet.getConfig()?.partnerId,
      }
    : undefined;

  const back = () => {
    setStatus("selecting");
    walletToConnect.current = undefined;
    props.onBack();
  };

  async function login(walletToLink: Wallet) {
    setStatus("loading");
    setError(undefined);
    walletToConnect.current = walletToLink;
    try {
      if (props.isLinking) {
        await linkProfile({
          chain: props.chain || wallet.getChain() || defineChain(1),
          client: props.client,
          ecosystem,
          strategy: "wallet",
          wallet: walletToLink,
        });
      } else {
        await wallet.connect({
          chain: props.chain || walletToLink.getChain() || defineChain(1),
          client: props.client,
          strategy: "wallet",
          wallet: walletToLink,
        });
      }
      addConnectedWallet(walletToLink);
      done();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setStatus("error");
    }
  }

  if (!walletToConnect.current) {
    if (showAll) {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <AllWalletsUI
            client={props.client}
            connectLocale={props.locale}
            disableSelectionDataReset={true}
            onBack={() => setShowAll(false)}
            onSelect={async (newWallet) => {
              login(newWallet);
              setShowAll(false);
            }}
            recommendedWallets={undefined}
            size={props.size}
            specifiedWallets={[]}
          />
        </Suspense>
      );
    }
    return (
      <WalletSelector
        chain={wallet.getChain()}
        chains={[]}
        client={props.client}
        connectLocale={props.locale}
        disableSelectionDataReset={true}
        done={() => {}}
        goBack={back}
        hideHeader={false}
        meta={props.meta || {}}
        modalHeader={{
          onBack: back,
          title: props.isLinking
            ? props.inAppLocale.linkWallet
            : props.inAppLocale.signInWithWallet,
        }}
        onShowAll={() => {
          setShowAll(true);
        }}
        recommendedWallets={undefined}
        selectWallet={async (newWallet) => {
          login(newWallet);
        }}
        setModalVisibility={() => {}}
        showAllWallets={true}
        size={props.size}
        title={props.locale.connectAWallet}
        walletConnect={props.walletConnect}
        walletIdsToHide={["inApp"]}
        wallets={getDefaultWallets()}
      />
    );
  }

  return (
    <Container animate="fadein" flex="column" fullHeight>
      <Container p="lg">
        <ModalHeader
          onBack={back}
          title={
            props.isLinking
              ? props.inAppLocale.linkWallet
              : props.inAppLocale.signInWithWallet
          }
        />
      </Container>

      <Container
        center="y"
        expand
        flex="column"
        px={props.size === "wide" ? "xxl" : "lg"}
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
            <LoadingState
              icon={
                <WalletImage
                  client={props.client}
                  id={walletToConnect.current.id ?? ""}
                  size={iconSize.xl}
                />
              }
              subtitle="A pop-up prompt will appear to sign-in and verify your wallet"
              title="Sign in with your wallet"
            />
          )}
        </div>
      </Container>
    </Container>
  );
}
