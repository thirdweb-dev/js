import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { Eip5792GetCapabilitiesPreview } from "../../../../components/account-abstraction/5792-get-capabilities";
import { Eip5792SendCallsPreview } from "../../../../components/account-abstraction/5792-send-calls";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  metadataBase,
  title: "EIP-5792 Wallet Capabilities | thirdweb Connect",
  description:
    "EIP-5792 capabilities allow you to view the capabilities of the connected wallet",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="EIP-5792 Wallet Capabilities"
        description={
          <>
            EIP-5792 capabilities allow you to view the capabilities of the
            connected wallet.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect/account-abstraction/overview?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <Eip5792GetCapabilities />
          <Eip5792SendCalls />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function Eip5792GetCapabilities() {
  return (
    <>
      <CodeExample
        header={{
          title: "Getting the wallet capabilities",
          description:
            "Get the capabilities of the connected wallet using the useCapabilities hook",
        }}
        preview={<Eip5792GetCapabilitiesPreview />}
        code={`\
import { useCapabilities } from "thirdweb/react";

function App() {
  // requires a connected wallet
  // try metamask or coinbase wallet to view their capabilities
  // works with in-app wallets too!
  const capabilities = useCapabilities();
  console.log(capabilities);

  return <div>Capabilities: {JSON.stringify(capabilities)}</div>;
}
`}
        lang="tsx"
      />
    </>
  );
}

function Eip5792SendCalls() {
  return (
    <>
      <CodeExample
        header={{
          title: "Sending calls to the wallet",
          description:
            "Send batched calls to the connected wallet using the useSendCalls hook",
        }}
        preview={<Eip5792SendCallsPreview />}
        lang="tsx"
        code={`\
import { useSendCalls } from "thirdweb/react";

function App() {
  const sendCalls = useSendCalls({
    client,
    waitForResult: true,
  });

  const handleClick = async () => {
    const result = await sendCalls.mutateAsync({
      calls: [firstTransaction, secondTransaction],
    });
    // result can be a either the transaction id
    // or the full transaction receipt if waitForResult is true
    if (typeof result === "string") {
      console.log("Transaction id", result);
    } else {
      console.log("Transaction hash", result.receipts?.[0]?.transactionHash);
    }
  };

  return <button onClick={handleClick}>Send calls</button>;
}
`}
      />
    </>
  );
}
