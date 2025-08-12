import { ScanTextIcon } from "lucide-react";
import { ReadContractRawPreview } from "@/components/blockchain-api/read-contract-raw";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Read Contract Data";
const description =
  "Read data from any contract on EVM with Type safe functions and hooks without needing contract ABIs";
const ogDescription =
  "Query smart contracts and wallet data using type-safe functions and React hooks—no ABI required. Read blockchain data with full type safety";

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
        icon={ScanTextIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/typescript/v5?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <ReadContractRaw />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ReadContractRaw() {
  return (
    <CodeExample
      code={`import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { MediaRenderer, useReadContract } from "thirdweb/react";

const onChainCryptoPunks = getContract({
  address: "0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

function App() {
  // Read the image of the tokenId #1
  const { data } = useReadContract({
    contract: onChainCryptoPunks,
    method: "function punkImageSvg(uint16 index) view returns (string svg)",
    params: [1],
  });

  return (
    <MediaRenderer
      client={THIRDWEB_CLIENT}
      src={data}
    />
  );
}
`}
      lang="tsx"
      preview={<ReadContractRawPreview />}
    />
  );
}
