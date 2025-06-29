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
        description={
          <>Transactions from user wallets with monitoring and retries.</>
        }
        docsLink="https://portal.thirdweb.com/engine?utm_source=playground"
        title="User Transactions"
      >
        <UserTransactions />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function UserTransactions() {
  return (
    <>
      <CodeExample
        code={`\
import { inAppWallet } from "thirdweb/wallets/in-app";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

const wallet = inAppWallet();

function App() {
  const activeWallet = useActiveWallet();

   const handleClick = async () => {
    const walletAddress = activeWallet?.getAccount()?.address;
     // transactions are a simple POST request to the engine API
	 // or use the @thirdweb-dev/engine type-safe JS SDK
    const response = await fetch(
	"https://api.thirdweb.com/v1/contract/write",
	{
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		"x-client-id": "<your-project-client-id>",
		// uses the in-app wallet's auth token to authenticate the request
		"Authorization": "Bearer " + activeWallet?.getAuthToken?.(),
		},
		body: JSON.stringify({
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
            "Engine can queue, monitor, and retry transactions from your users in-app wallets. All transactions and analytics will be displayed in your developer dashboard.",
          title: "Transactions from User Wallets",
        }}
        lang="tsx"
        preview={<GatewayPreview />}
      />
    </>
  );
}
