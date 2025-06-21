"use client";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { isEcosystemWallet } from "../../../../../wallets/ecosystem/is-ecosystem-wallet.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { EcosystemWalletId } from "../../../../../wallets/wallet-types.js";
import { iconSize } from "../../../../core/design-system/index.js";
import { useActiveWallet } from "../../../../core/hooks/wallets/useActiveWallet.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { useAdminWallet } from "../../../../core/hooks/wallets/useAdminWallet.js";
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
  const adminWallet = useAdminWallet();
  const activeWallet = useActiveWallet();
  const chain = useActiveWalletChain();
  const queryClient = useQueryClient();

  const wallet = adminWallet || activeWallet;

  if (!wallet) {
    return <LoadingScreen />;
  }

  if (wallet.id === "inApp") {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <InAppWalletConnectUI
          chain={chain}
          client={props.client}
          connectLocale={props.locale}
          done={() => {
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["profiles"] });
            }, 500);
            props.onBack();
          }}
          goBack={props.onBack}
          isLinking={true}
          meta={{
            showThirdwebBranding: false,
            title: props.locale.manageWallet.linkProfile,
          }}
          size="compact"
          wallet={wallet as Wallet<"inApp">}
          walletConnect={props.walletConnect}
        />
      </Suspense>
    );
  }

  if (isEcosystemWallet(wallet)) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <EcosystemWalletConnectUI
          chain={chain}
          client={props.client}
          connectLocale={props.locale}
          done={() => {
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["profiles"] });
            }, 500);
            props.onBack();
          }}
          goBack={props.onBack}
          isLinking={true}
          meta={{
            showThirdwebBranding: false,
            title: props.locale.manageWallet.linkProfile,
          }}
          size="compact"
          wallet={wallet as Wallet<EcosystemWalletId>}
          walletConnect={props.walletConnect}
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
          onBack={props.onBack}
          title={props.locale.manageWallet.linkProfile}
        />
      </Container>
      <Line />
      <Container
        center="both"
        color="secondaryText"
        flex="column"
        gap="md"
        px="xl"
        style={{
          flex: "1",
          minHeight: "250px",
        }}
      >
        <CrossCircledIcon height={iconSize.xl} width={iconSize.xl} />
        <Text center>This wallet does not support account linking</Text>
      </Container>
    </Container>
  );
}
