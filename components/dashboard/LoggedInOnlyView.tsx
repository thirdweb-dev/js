import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { ComponentWithChildren } from "types/component-with-children";

export const LoggedInOnlyView: ComponentWithChildren = ({ children }) => {
  const { isLoggedIn } = useLoggedInUser();
  if (!isLoggedIn) {
    return <ConnectWalletPrompt />;
  }
  return <>{children}</>;
};
