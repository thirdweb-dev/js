import type { Chain } from "../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../client/client.js";
import { getDefaultWallets } from "../../../../../wallets/defaultWallets.js";
import type { Wallet } from "../../../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../../../wallets/types.js";
import type { WalletId } from "../../../../../wallets/wallet-types.js";
import { useActiveWalletChain } from "../../../../core/hooks/wallets/useActiveWalletChain.js";
import { useConnectedWallets } from "../../../../core/hooks/wallets/useConnectedWallets.js";
import type { ConnectLocale } from "../locale/types.js";
import { ConnectModalContent } from "../Modal/ConnectModalContent.js";
import { useSetupScreen } from "../Modal/screen.js";

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
  hiddenWallets?: WalletId[];
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
  const walletChain = useActiveWalletChain();
  const connectedWallets = useConnectedWallets();
  const wallets =
    props.wallets ||
    getDefaultWallets({
      appMetadata: props.appMetadata,
      chains: props.chains,
    }).filter((w) => w.id !== "inApp");

  const screenSetup = useSetupScreen({
    size: "compact",
    wallets: wallets,
    welcomeScreen: undefined,
  });

  return (
    <ConnectModalContent
      accountAbstraction={props.accountAbstraction}
      auth={undefined}
      chain={props.chain || walletChain}
      chains={props.chains}
      client={props.client}
      connectLocale={props.connectLocale}
      hideHeader={props.isEmbed}
      isOpen={true}
      meta={{
        showThirdwebBranding: false,
      }}
      modalHeader={{
        onBack: props.onBack,
        title: "Connect",
      }}
      onClose={() => {}}
      onConnect={(w) => {
        props.onSelect(w);
        props.onBack();
      }}
      recommendedWallets={props.recommendedWallets}
      screenSetup={screenSetup}
      setModalVisibility={() => {}}
      shouldSetActive={false}
      showAllWallets={props.showAllWallets}
      size="compact"
      walletConnect={props.walletConnect}
      walletIdsToHide={connectedWallets.map((x) => x.id)}
      wallets={wallets}
      welcomeScreen={undefined}
    />
  );
}
