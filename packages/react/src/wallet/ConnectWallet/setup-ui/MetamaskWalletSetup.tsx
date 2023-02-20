import { iconSize } from "../../../design-system";
import { NoticeShell } from "./shared/NoticeShell";
import { MetamaskIcon } from "./shared/icons/MetamaskIcon";

export const MetamaskWalletSetup: React.FC<{ onBack: () => void }> = (
  props,
) => {
  return (
    <NoticeShell
      onBack={props.onBack}
      loading
      title="Connecting to Metamask"
      description="Login and connect your wallet through the metamask pop-up"
      icon={<MetamaskIcon width={iconSize.xl} height={iconSize.xl} />}
      helper={{
        text: "Having troubles connecting to metamask?",
        link: "/foo/bar",
      }}
    />
  );
};
