import { User2Icon } from "lucide-react";
import type { Metadata } from "next";
import { GatewayPreview } from "@/components/account-abstraction/gateway";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";

export const metadata: Metadata = {
  description: "Transactions from user wallets with monitoring and retries",
  metadataBase,
  title: "User Transactions | thirdweb",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={User2Icon}
        description={
          <>Transactions from user wallets with monitoring and retries.</>
        }
        docsLink="https://portal.thirdweb.com/transactions?utm_source=playground"
        title="User Transactions"
      >
        <UserTransactions />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function UserTransactions() {
  return (
    <CodeExample
      code={`\
import { inAppWallet } from "thirdweb/wallets/in-app";
import { ConnectButton, useActiveWallet } from "thirdweb/react";

const wallet = inAppWallet();

function App() {
  const activeWallet = useActiveWallet();

   const handleClick = async () => {
    const walletAddress = activeWallet?.getAccount()?.address;
    const authToken = activeWallet?.getAuthToken?.();
    // transactions are a simple POST request to the thirdweb API
	 // or use the @thirdweb-dev/api type-safe JS SDK
    const response = await fetch(
	"https://api.thirdweb.com/v1/contract/write",
	{
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		"x-client-id": "<your-project-client-id>",
		// uses the in-app wallet's auth token to authenticate the request
		"Authorization": "Bearer " + authToken,
		},
		body: JSON.stringify({
			from: walletAddress,
			chainId: "84532",
		calls: [
			{
			contractAddress: "0x...",
			method: "function claim(address to, uint256 amount)",
			params: [walletAddress, "1"],
			},
		],
		}),
    });
  };

  return (
    <>
      <ConnectButton
        client={client}
        wallet={[wallet]}
        connectButton={{
          label: "Login to mint!",
        }}
      />
      <Button
        onClick={handleClick}
      >
        Mint
      </Button>
    </>
  );
}`}
      header={{
        description:
          "Queue, monitor, and retry transactions from your users in-app wallets. All transactions and analytics will be displayed in your developer dashboard.",
        title: "Transactions from User Wallets",
      }}
      lang="tsx"
      preview={<GatewayPreview />}
    />
  );
}
