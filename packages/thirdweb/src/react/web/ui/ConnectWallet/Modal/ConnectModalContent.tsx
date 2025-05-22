"use client";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Profile } from "../../../../../wallets/in-app/core/authentication/types.js";
import { getProfiles } from "../../../../../wallets/in-app/web/lib/auth/index.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import {
  type SiweAuthOptions,
  useSiweAuth,
} from "../../../../core/hooks/auth/useSiweAuth.js";
import { useActiveAccount } from "../../../../core/hooks/wallets/useActiveAccount.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useSetActiveWallet } from "../../../../core/hooks/wallets/useSetActiveWallet.js";
import { useConnectionManager } from "../../../../core/providers/connection-manager.js";
import { useProfiles } from "../../../hooks/wallets/useProfiles.js";
import { useSetSelectionData } from "../../../providers/wallet-ui-states-provider.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { WalletSelector } from "../WalletSelector.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import type { ConnectLocale } from "../locale/types.js";
import { LinkProfileScreen } from "../screens/LinkProfileScreen.js";
import { SignatureScreen } from "../screens/SignatureScreen.js";
import { StartScreen } from "../screens/StartScreen.js";
import type { WelcomeScreen } from "../screens/types.js";
import { AnyWalletConnectUI } from "./AnyWalletConnectUI.js";
import {
  ConnectModalCompactLayout,
  ConnectModalWideLayout,
} from "./ConnectModalSkeleton.js";
import { SmartConnectUI } from "./SmartWalletConnectUI.js";
import { type ScreenSetup, ScreenSetupContext } from "./screen.js";

const AllWalletsUI = /* @__PURE__ */ lazy(() => import("./AllWalletsUI.js"));

/**
 * @internal
 */
export const ConnectModalContent = (props: {
  screenSetup: ScreenSetup;
  onClose: (() => void) | undefined;
  isOpen: boolean;
  setModalVisibility: (value: boolean) => void;
  shouldSetActive: boolean;
  wallets: Wallet[];
  accountAbstraction: SmartWalletOptions | undefined;
  auth: SiweAuthOptions | undefined;
  onConnect: ((wallet: Wallet) => void) | undefined;
  size: "compact" | "wide";
  meta: {
    title?: string;
    titleIconUrl?: string;
    showThirdwebBranding?: boolean;
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
    requireApproval?: boolean;
  };
  welcomeScreen: WelcomeScreen | undefined;
  connectLocale: ConnectLocale;
  client: ThirdwebClient;
  hideHeader: boolean;
  recommendedWallets: Wallet[] | undefined;
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  showAllWallets: boolean | undefined;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  modalHeader:
    | {
        title: string;
        onBack: () => void;
      }
    | undefined;
  walletIdsToHide: WalletId[] | undefined;
}) => {
  const { setModalVisibility, onClose, shouldSetActive } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const setActiveWallet = useSetActiveWallet();
  const setSelectionData = useSetSelectionData();
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const siweAuth = useSiweAuth(activeWallet, activeAccount, props.auth);
  const showSignatureScreen = siweAuth.requiresAuth && !siweAuth.isLoggedIn;
  const connectionManager = useConnectionManager();

  // state to hold wallet awaiting email link
  const [pendingWallet, setPendingWallet] = useState<Wallet | undefined>();

  // get profiles to observe email linking
  const profilesQuery = useProfiles({ client: props.client });

  const handleConnected = useCallback(
    async (wallet: Wallet) => {
      // we will only set active wallet and call onConnect once requirements are met
      const finalizeConnection = (w: Wallet) => {
        if (shouldSetActive) {
          setActiveWallet(w);
        } else {
          connectionManager.addConnectedWallet(w);
        }

        if (props.onConnect) {
          props.onConnect(w);
        }

        onModalUnmount(() => {
          setSelectionData({});
          setScreen(initialScreen);
          setModalVisibility(true);
        });
      };

      // ----------------------------------------------------------------
      // Enforce required profile linking (currently only "email")
      // ----------------------------------------------------------------
      type WalletConfig = {
        auth?: {
          required?: string[];
        };
        partnerId?: string;
      };

      const walletWithConfig = wallet as unknown as {
        getConfig?: () => WalletConfig | undefined;
      };

      const walletConfig = walletWithConfig.getConfig
        ? walletWithConfig.getConfig()
        : undefined;
      const required = walletConfig?.auth?.required as string[] | undefined;
      const requiresEmail = required?.includes("email");

      console.log("wallet", walletConfig);

      console.log("requiresEmail", requiresEmail);

      if (requiresEmail) {
        try {
          const ecosystem = isEcosystemWallet(wallet)
            ? { id: wallet.id, partnerId: walletConfig?.partnerId }
            : undefined;

          const profiles = await getProfiles({
            client: props.client,
            ecosystem,
          });

          console.log("profiles", profiles);

          const hasEmail = (profiles as Profile[]).some(
            (p) => !!p.details.email,
          );

          console.log("hasEmail", hasEmail);

          if (!hasEmail) {
            setPendingWallet(wallet);
            setScreen(reservedScreens.linkProfile);
            return; // defer activation until linked
          }
        } catch (err) {
          console.error("Failed to fetch profiles for required linking", err);
          // if fetching profiles fails, just continue the normal flow
        }
      }

      // ----------------------------------------------------------------
      // Existing behavior (sign in step / close modal)
      // ----------------------------------------------------------------

      if (showSignatureScreen) {
        setScreen(reservedScreens.signIn);
      } else {
        finalizeConnection(wallet);
        onClose?.();
      }
    },
    [
      shouldSetActive,
      setActiveWallet,
      connectionManager,
      props.onConnect,
      setSelectionData,
      setModalVisibility,
      props.client,
      setScreen,
      showSignatureScreen,
      initialScreen,
      onClose,
    ],
  );

  // Effect to watch for email linking completion
  useEffect(() => {
    if (!pendingWallet) {
      return;
    }
    const profiles = profilesQuery.data;
    if (!profiles) {
      return;
    }
    const hasEmail = profiles.some((p) => !!p.details.email);
    if (hasEmail) {
      // finalize connection now
      if (shouldSetActive) {
        setActiveWallet(pendingWallet);
      } else {
        connectionManager.addConnectedWallet(pendingWallet);
      }
      props.onConnect?.(pendingWallet);
      setPendingWallet(undefined);
      setScreen(initialScreen);
      onClose?.();
    }
  }, [
    profilesQuery.data,
    pendingWallet,
    shouldSetActive,
    setActiveWallet,
    connectionManager,
    props.onConnect,
    setScreen,
    initialScreen,
    onClose,
  ]);

  const handleBack = useCallback(() => {
    setSelectionData({});
    setScreen(initialScreen);
  }, [setScreen, initialScreen, setSelectionData]);

  const walletList = (
    <WalletSelector
      title={props.meta.title || props.connectLocale.defaultModalTitle}
      wallets={props.wallets}
      selectWallet={(newWallet) => {
        if (newWallet.onConnectRequested) {
          newWallet
            .onConnectRequested()
            .then(() => setScreen(newWallet))
            .catch(console.error); // TODO propagate error down
        } else {
          setScreen(newWallet);
        }
      }}
      onShowAll={() => {
        setScreen(reservedScreens.showAll);
      }}
      done={async (w) => {
        await handleConnected(w);
      }}
      goBack={props.wallets.length > 1 ? handleBack : undefined}
      setModalVisibility={setModalVisibility}
      client={props.client}
      connectLocale={props.connectLocale}
      hideHeader={props.hideHeader}
      recommendedWallets={props.recommendedWallets}
      accountAbstraction={props.accountAbstraction}
      chain={props.chain}
      showAllWallets={props.showAllWallets}
      chains={props.chains}
      walletConnect={props.walletConnect}
      meta={props.meta}
      size={props.size}
      modalHeader={props.modalHeader}
      walletIdsToHide={props.walletIdsToHide}
    />
  );

  const showAll = (
    <Suspense fallback={<LoadingScreen />}>
      <AllWalletsUI
        onBack={handleBack}
        onSelect={setScreen}
        client={props.client}
        connectLocale={props.connectLocale}
        recommendedWallets={props.recommendedWallets}
        specifiedWallets={props.wallets}
        size={props.size}
      />
    </Suspense>
  );

  const getStarted = (
    <StartScreen
      client={props.client}
      connectLocale={props.connectLocale}
      meta={props.meta}
      welcomeScreen={props.welcomeScreen}
    />
  );

  const goBack = props.wallets.length > 1 ? handleBack : undefined;

  const getWalletUI = (wallet: Wallet) => {
    if (props.accountAbstraction) {
      return (
        <SmartConnectUI
          key={wallet.id}
          accountAbstraction={props.accountAbstraction}
          done={async (smartWallet) => {
            await handleConnected(smartWallet);
          }}
          personalWallet={wallet}
          onBack={goBack}
          setModalVisibility={props.setModalVisibility}
          meta={props.meta}
          size={props.size}
          chain={props.chain}
          chains={props.chains}
          client={props.client}
          walletConnect={props.walletConnect}
          connectLocale={props.connectLocale}
        />
      );
    }

    return (
      <AnyWalletConnectUI
        key={wallet.id}
        wallet={wallet}
        onBack={goBack}
        done={async () => {
          await handleConnected(wallet);
        }}
        setModalVisibility={props.setModalVisibility}
        chain={props.chain}
        chains={props.chains}
        client={props.client}
        meta={props.meta}
        size={props.size}
        walletConnect={props.walletConnect}
        connectLocale={props.connectLocale}
      />
    );
  };

  const signatureScreen = (
    <SignatureScreen
      onDone={onClose}
      onClose={onClose}
      modalSize={props.size}
      termsOfServiceUrl={props.meta.termsOfServiceUrl}
      privacyPolicyUrl={props.meta.privacyPolicyUrl}
      auth={props.auth}
      client={props.client}
      connectLocale={props.connectLocale}
    />
  );

  const linkProfileScreen = (
    <LinkProfileScreen
      onBack={handleBack}
      locale={props.connectLocale}
      client={props.client}
      walletConnect={props.walletConnect}
      wallet={pendingWallet}
    />
  );

  return (
    <ScreenSetupContext.Provider value={props.screenSetup}>
      {props.size === "wide" ? (
        <ConnectModalWideLayout
          left={walletList}
          right={
            <>
              {screen === reservedScreens.signIn && signatureScreen}
              {screen === reservedScreens.main && getStarted}
              {screen === reservedScreens.getStarted && getStarted}
              {screen === reservedScreens.showAll && showAll}
              {screen === reservedScreens.linkProfile && linkProfileScreen}
              {typeof screen !== "string" && getWalletUI(screen)}
            </>
          }
        />
      ) : (
        <ConnectModalCompactLayout>
          {screen === reservedScreens.signIn && signatureScreen}
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {screen === reservedScreens.showAll && showAll}
          {screen === reservedScreens.linkProfile && linkProfileScreen}
          {typeof screen !== "string" && getWalletUI(screen)}
        </ConnectModalCompactLayout>
      )}
    </ScreenSetupContext.Provider>
  );
};
