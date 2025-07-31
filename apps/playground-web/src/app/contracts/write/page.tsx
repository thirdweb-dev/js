import { PencilIcon } from "lucide-react";
import { WriteContractRawPreview } from "@/components/blockchain-api/write-contract-raw";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";

const title = "Write Contract";
const description =
  "Send transactions from the connected wallet using type-safe functions and hooks for contract calls or raw transactions";

const ogDescription =
  "Send blockchain transactions with the connected wallet using type-safe functions and React hooks for contract calls or raw transactions";

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
        icon={PencilIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/typescript/v5?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <WriteContractRaw />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function WriteContractRaw() {
  return (
    <CodeExample
      code={`import { getContract, prepareContractCall, toUnits } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const tw_coin = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});


function App() {
  return <TransactionButton
    transaction={() =>
      prepareContractCall({
        contract: tw_coin,
        method:
          "function transfer(address to, uint256 value) returns (bool)",
        params: [
          "0x...",
          toUnits("5", 18),
        ],
      })
    }
  >
    Send
  </TransactionButton>
}
`}
      lang="tsx"
      preview={<WriteContractRawPreview />}
    />
  );
}
