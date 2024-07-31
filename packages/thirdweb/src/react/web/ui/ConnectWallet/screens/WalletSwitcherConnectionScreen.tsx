import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../../wallets/types.js";
import { useConnectedWallets } from "../../../../core/hooks/wallets/useConnectedWallets.js";
import { getDefaultWallets } from "../../../wallets/defaultWallets.js";
import { ConnectModalContent } from "../Modal/ConnectModalContent.js";
import { useSetupScreen } from "../Modal/screen.js";
import type { ConnectLocale } from "../locale/types.js";

export type WalletSwitcherConnectionScreenProps = {
  chain: Chain | undefined;
  chains: Chain[] | undefined;
  client: ThirdwebClient;
  wallets: Wallet[] | undefined;
  appMetadata: AppMetadata | undefined;
  connectLocale: ConnectLocale;
  isEmbed: boolean;
  accountAbstraction: SmartWalletOptions | undefined;
  onSelect: (wallet: Wallet) => void;
  recommendedWallets: Wallet[] | undefined;
  showAllWallets: boolean;
  walletConnect:
    | {
        projectId?: string;
      }
    | undefined;
  onBack: () => void;
};

export function WalletSwitcherConnectionScreen(
  props: WalletSwitcherConnectionScreenProps,
) {
  const connectedWallets = useConnectedWallets();
  const wallets =
    props.wallets ||
    getDefaultWallets({
      appMetadata: props.appMetadata,
      chains: props.chains,
    });

  const screenSetup = useSetupScreen({
    size: "compact",
    welcomeScreen: undefined,
    wallets: wallets,
  });

  return (
    <ConnectModalContent
      accountAbstraction={props.accountAbstraction}
      auth={undefined}
      chain={props.chain}
      chains={props.chains}
      client={props.client}
      connectLocale={props.connectLocale}
      isEmbed={props.isEmbed}
      isOpen={true}
      meta={{
        showThirdwebBranding: false,
      }}
      onClose={() => {}}
      onConnect={(w) => {
        props.onSelect(w);
        props.onBack();
      }}
      recommendedWallets={props.recommendedWallets}
      screenSetup={screenSetup}
      welcomeScreen={undefined}
      wallets={wallets}
      setModalVisibility={() => {}}
      shouldSetActive={false}
      showAllWallets={props.showAllWallets}
      size="compact"
      walletConnect={props.walletConnect}
      modalHeader={{
        title: "Connect",
        onBack: props.onBack,
      }}
      walletIdsToHide={connectedWallets.map((x) => x.id)}
    />
  );
}
