import { Card } from "@/components/ui/card";
import { CustomConnectWallet } from "@3rdweb-sdk/react/components/connect-wallet";

interface ConnectWalletPromptProps {
  title?: string;
  prefix?: string;
  description?: string;
}

export const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({
  title = "Connect your wallet",
  prefix = "Sign-in with your wallet to",
  description = "",
}) => {
  return (
    <div className="container max-w-[600px]">
      <Card className="flex flex-col gap-2 p-6">
        <h2 className="text-lg font-bold">{title}</h2>
        <p>
          {prefix} {description || "get started"}.
        </p>
        <div className="border-b my-4" />
        <CustomConnectWallet />
      </Card>
    </div>
  );
};
