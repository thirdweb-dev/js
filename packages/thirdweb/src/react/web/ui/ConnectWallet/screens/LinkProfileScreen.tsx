"use client";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../../wallets/wallet-types.js";
import { iconSize } from "../../../../core/design-system/index.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { useAdminWallet } from "../../../../core/hooks/wallets/useAdminAccount.js";
import EcosystemWalletConnectUI from "../../../wallets/ecosystem/EcosystemWalletConnectUI.js";
import { LoadingScreen } from "../../../wallets/shared/LoadingScreen.js";
import { Container, Line, ModalHeader } from "../../components/basic.js";
import { Text } from "../../components/text.js";
import type { ConnectLocale } from "../locale/types.js";

const InAppWalletConnectUI = /* @__PURE__ */ lazy(
  () => import("../../../wallets/in-app/InAppWalletConnectUI.js"),
);

/**
 * @internal
 */
export function LinkProfileScreen(props: {
  onBack: () => void;
  locale: ConnectLocale;
  client: ThirdwebClient;
  walletConnect: { projectId?: string } | undefined;
}) {
  const activeWallet = useAdminWallet();
  const chain = useActiveWalletChain();
  const queryClient = useQueryClient();

  if (!activeWallet) {
    return <LoadingScreen />;
  }

  if (activeWallet.id === "inApp") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <InAppWalletConnectUI
          walletConnect={props.walletConnect}
          wallet={activeWallet as Wallet<"inApp">}
          done={() => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            props.onBack();
          }}
          connectLocale={props.locale}
          client={props.client}
          size="compact"
          chain={chain}
          meta={{
            title: props.locale.manageWallet.linkProfile,
            showThirdwebBranding: false,
          }}
          isLinking={true}
          goBack={props.onBack}
        />
      </Suspense>
    );
  }

  if (isEcosystemWallet(activeWallet)) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EcosystemWalletConnectUI
          wallet={activeWallet as Wallet<EcosystemWalletId>}
          done={() => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            props.onBack();
          }}
          connectLocale={props.locale}
          client={props.client}
          size="compact"
          chain={chain}
          meta={{
            title: props.locale.manageWallet.linkProfile,
            showThirdwebBranding: false,
          }}
          isLinking={true}
          goBack={props.onBack}
        />
      </Suspense>
    );
  }

  return (
    <Container
      style={{
        minHeight: "300px",
      }}
    >
      <Container p="lg">
        <ModalHeader
          title={props.locale.manageWallet.linkProfile}
          onBack={props.onBack}
        />
      </Container>
      <Line />
      <Container
        flex="column"
        gap="md"
        center="both"
        px="xl"
        color="secondaryText"
        style={{
          flex: "1",
          minHeight: "250px",
        }}
      >
        <CrossCircledIcon width={iconSize.xl} height={iconSize.xl} />
        <Text center>This wallet does not support account linking</Text>
      </Container>
    </Container>
  );
}
