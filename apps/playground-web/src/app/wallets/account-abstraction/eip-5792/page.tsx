import type { Metadata } from "next";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import { Eip5792GetCapabilitiesPreview } from "../../../../components/account-abstraction/5792-get-capabilities";
import { Eip5792SendCallsPreview } from "../../../../components/account-abstraction/5792-send-calls";
import { PageLayout } from "../../../../components/blocks/APIHeader";
import { CodeExample } from "../../../../components/code/code-example";

export const metadata: Metadata = {
  description:
    "EIP-5792 capabilities allow you to view the capabilities of the connected wallet",
  metadataBase,
  title: "EIP-5792 Wallet Capabilities | thirdweb Connect",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        description={
          <>
            EIP-5792 capabilities allow you to view the capabilities of the
            connected wallet.
          </>
        }
        docsLink="https://portal.thirdweb.com/wallets/sponsor-gas?utm_source=playground"
        title="EIP-5792 Wallet Capabilities"
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
    <CodeExample
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
      header={{
        description:
          "Get the capabilities of the connected wallet using the useCapabilities hook",
        title: "Getting the wallet capabilities",
      }}
      lang="tsx"
      preview={<Eip5792GetCapabilitiesPreview />}
    />
  );
}

const code = `\
import { useSendCalls, useWaitForCallsReceipt } from "thirdweb/react";

function App() {
const { mutate: sendCalls, isPending, data } = useSendCalls();
const { data: receipt, isLoading: isConfirming } = useWaitForCallsReceipt(data);

const handleClick = async () => {
  sendCalls({
    calls: [firstTransaction, secondTransaction],
  });
};

return (
  <>
    <button onClick={handleClick}>Send calls</button>
    {isPending && <p>Sending...</p>}
    {isConfirming && <p>Confirming...</p>}
    {receipt && <p>Confirmed! {receipt?.receipts?.[0]?.transactionHash}</p>}
  </>
);
}
`;

function Eip5792SendCalls() {
  return (
    <CodeExample
      code={code}
      header={{
        description:
          "Send batched calls to the connected wallet using the useSendCalls hook",
        title: "Sending calls to the wallet",
      }}
      lang="tsx"
      preview={<Eip5792SendCallsPreview />}
    />
  );
}
