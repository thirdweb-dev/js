import { BlocksIcon } from "lucide-react";
import { ReadContractExtensionPreview } from "@/components/blockchain-api/read-contract-extension";
import { WriteContractExtensionPreview } from "@/components/blockchain-api/write-contract-extension";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { createMetadata } from "../../../lib/metadata";

const title = "Pre-Built Extensions";
const description =
  "High-level ready and write functions with built-in pre/post-processing for common standards.";

const ogDescription =
  "Simplify smart contract reads and writes with prebuilt extensions. Handle approvals, formatting, and standards with built-in pre/post-processing.";

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
        icon={BlocksIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/typescript/v5?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <ReadContractExtension />
          <WriteContractExtension />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ReadContractExtension() {
  return (
    <CodeExample
      code={`import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { MediaRenderer, useReadContract } from "thirdweb/react";

const nftContract = getContract({
  address: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  chain: ethereum,
  client: THIRDWEB_CLIENT,
});

function App() {
  const { data } = useReadContract(getNFT, {
    contract: nftContract,
    tokenId: 458n,
  });

  return (
    <MediaRenderer
      client={THIRDWEB_CLIENT}
      src={data?.metadata.image}
    />
  );
}
`}
      header={{
        description:
          "Extensions let you do more with less code. High level functions with simple API that do pre and post processing for all common standards.",
        title: "Prebuilt read extensions",
      }}
      lang="tsx"
      preview={<ReadContractExtensionPreview />}
    />
  );
}

function WriteContractExtension() {
  return (
    <CodeExample
      code={`import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc20";

const tw_coin = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});

function App() {
  return <TransactionButton
    transaction={() =>
      claimTo({
        contract: twCoinContract,
        to: account.address,
        quantity: "10",
      })
    }
  >
    Claim
  </TransactionButton>
}
`}
      header={{
        description:
          "Extensions let you do more with less code. High level functions with simple API that do pre and post processing for all common standards.",
        title: "Prebuilt write extensions",
      }}
      lang="tsx"
      preview={<WriteContractExtensionPreview />}
    />
  );
}
