import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { ConnectWalletPrompt } from "components/settings/ConnectWalletPrompt";
import { ReactNode } from "react";

interface LoggedInOnlyViewProps {
  children: ReactNode;
  description?: string;
}

export const LoggedInOnlyView: React.FC<LoggedInOnlyViewProps> = ({
  children,
  description,
}) => {
  const { isLoggedIn } = useLoggedInUser();
  if (!isLoggedIn) {
    return <ConnectWalletPrompt description={description} />;
  }
  return <>{children}</>;
};
