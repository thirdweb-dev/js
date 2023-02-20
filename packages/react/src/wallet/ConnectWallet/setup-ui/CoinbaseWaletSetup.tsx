import { iconSize } from "../../../design-system";
import { NoticeShell } from "./shared/NoticeShell";
import { CoinbaseWalletIcon } from "./shared/icons/CoinbaseWalletIcon";

export const CoinbaseWalletSetup: React.FC<{ onBack: () => void }> = (
  props,
) => {
  return (
    <NoticeShell
      onBack={props.onBack}
      loading
      title="Connecting your wallet"
      description="Login and connect your wallet through the metamask pop-up"
      icon={<CoinbaseWalletIcon width={iconSize.xl} height={iconSize.xl} />}
      helper={{
        text: "Having troubles connecting to metamask?",
        link: "/foo/bar",
      }}
    />
  );
};
