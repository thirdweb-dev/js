import { Suspense, lazy, useCallback } from "react";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import { useConnectUI } from "../../../../core/hooks/others/useWalletConnectionCtx.js";
import { useConnect } from "../../../../core/hooks/wallets/wallet-hooks.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { WalletSelector } from "../WalletSelector.js";
import { onModalUnmount, reservedScreens } from "../constants.js";
import { StartScreen } from "../screens/StartScreen.js";
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
  onClose: () => void;
  isOpen: boolean;
  setModalVisibility: (value: boolean) => void;
}) => {
  const { setModalVisibility, onClose } = props;
  const { screen, setScreen, initialScreen } = props.screenSetup;
  const { wallets, accountAbstraction } = useConnectUI();
  const { onConnect, connectModal, connectLocale } = useConnectUI();
  const { connect } = useConnect();

  const handleConnected = useCallback(
    (wallet: Wallet) => {
      connect(wallet);

      if (onConnect) {
        onConnect(wallet);
      }

      onModalUnmount(() => {
        setModalVisibility(true);
      });

      onClose();
    },
    [setModalVisibility, onClose, onConnect, connect],
  );

  const handleBack = useCallback(() => {
    setScreen(initialScreen);
  }, [setScreen, initialScreen]);

  const walletList = (
    <WalletSelector
      title={connectModal.title || connectLocale.defaultModalTitle}
      wallets={wallets}
      onGetStarted={() => {
        setScreen(reservedScreens.getStarted);
      }}
      selectWallet={setScreen}
      onShowAll={() => {
        setScreen(reservedScreens.showAll);
      }}
      done={handleConnected}
      goBack={wallets.length > 1 ? handleBack : undefined}
    />
  );

  const showAll = (
    <Suspense fallback={<LoadingScreen />}>
      <AllWalletsUI onBack={handleBack} onSelect={setScreen} />
    </Suspense>
  );

  const getStarted = <StartScreen />;

  const goBack = wallets.length > 1 ? handleBack : undefined;

  const getWalletUI = (wallet: Wallet) => {
    if (accountAbstraction) {
      return (
        <SmartConnectUI
          key={wallet.id}
          accountAbstraction={accountAbstraction}
          done={(smartWallet) => {
            handleConnected(smartWallet);
          }}
          personalWallet={wallet}
          onBack={goBack}
          setModalVisibility={props.setModalVisibility}
        />
      );
    }

    return (
      <AnyWalletConnectUI
        key={wallet.id}
        wallet={wallet}
        onBack={goBack}
        done={() => {
          handleConnected(wallet);
        }}
        setModalVisibility={props.setModalVisibility}
      />
    );
  };

  return (
    <ScreenSetupContext.Provider value={props.screenSetup}>
      {connectModal.size === "wide" ? (
        <ConnectModalWideLayout
          left={walletList}
          right={
            <>
              {/* {screen === reservedScreens.signIn && signatureScreen} */}
              {screen === reservedScreens.main && getStarted}
              {screen === reservedScreens.getStarted && getStarted}
              {screen === reservedScreens.showAll && showAll}
              {typeof screen !== "string" && getWalletUI(screen)}
            </>
          }
        />
      ) : (
        <ConnectModalCompactLayout>
          {/* {screen === reservedScreens.signIn && signatureScreen} */}
          {screen === reservedScreens.main && walletList}
          {screen === reservedScreens.getStarted && getStarted}
          {screen === reservedScreens.showAll && showAll}
          {typeof screen !== "string" && getWalletUI(screen)}
        </ConnectModalCompactLayout>
      )}
    </ScreenSetupContext.Provider>
  );
};
