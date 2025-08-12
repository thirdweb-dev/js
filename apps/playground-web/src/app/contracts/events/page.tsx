import { RssIcon } from "lucide-react";
import { WatchEventPreview } from "@/components/blockchain-api/watch-event-preview";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";

const title = "Listen Contract Events";
const description =
  "Subscribe to any contract event with auto-polling hooks and type-safe event handlers. Supports all common standards out of the box";

const ogDescription =
  "Listen to blockchain contract events using auto-polling hooks and type-safe functions. Supports ERC20, ERC721, and other common Web3 standards with minimal setup.";

export const metadata = createMetadata({
  title,
  description: ogDescription,
  image: {
    icon: "contract",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={RssIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/typescript/v5?utm_source=playground"
      >
        <WatchEvent />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function WatchEvent() {
  return (
    <CodeExample
      code={`import { useContractEvents } from "thirdweb/react";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { transferEvent } from "thirdweb/extensions/erc20";

const usdcContractOnBase = getContract({
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  chain: base,
  client,
});

function App() {
  // Listen to USDC transfers on Base
  const contractEvents = useContractEvents({
    contract: usdcContractOnBase,
    events: [transferEvent()],
    blockRange: 100,
  });

  (contractEvents.data || []).forEach((item) => {
    const { from, to, value } = item.args;
    console.log("{from}...{value} USDC...{to}");
  });
}
`}
      lang="tsx"
      preview={<WatchEventPreview />}
    />
  );
}
