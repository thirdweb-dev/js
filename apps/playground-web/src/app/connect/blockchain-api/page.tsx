import { ReadContractExtensionPreview } from "@/components/blockchain-api/read-contract-extension";
import { ReadContractRawPreview } from "@/components/blockchain-api/read-contract-raw";
import { WatchEventPreview } from "@/components/blockchain-api/watch-event-preview";
import { WriteContractExtensionPreview } from "@/components/blockchain-api/write-contract-extension";
import { WriteContractRawPreview } from "@/components/blockchain-api/write-contract-raw";
import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { PageLayout } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Blockchain API | thirdweb Connect",
  description:
    "Interact with EVM blockchains using thirdweb SDK. Create seamless NFT minting experience. Airdrop tokens to millions of users",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Blockchain API"
        description={
          <>
            Performant, reliable and type safe API to read write to any contract
            on any EVM chain through our RPC Edge endpoints.
          </>
        }
        docsLink="https://portal.thirdweb.com/typescript/v5?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <ReadContractRaw />
          <ReadContractExtension />
          <WriteContractExtension />
          <WriteContractRaw />

          <WatchEvent />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}

function ReadContractRaw() {
  return (
    <CodeExample
      header={{
        title: "Query blockchain data",
        description:
          "Read data from any contract or wallet. Type safe functions and hooks without needing full ABIs.",
      }}
      preview={<ReadContractRawPreview />}
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
    />
  );
}

function ReadContractExtension() {
  return (
    <CodeExample
      header={{
        title: "Prebuilt read extensions",
        description:
          "Extensions let you do more with less code. High level functions with simple API that do pre and post processing for all common standards.",
      }}
      preview={<ReadContractExtensionPreview />}
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
      lang="tsx"
    />
  );
}

function WriteContractExtension() {
  return (
    <CodeExample
      header={{
        title: "Prebuilt write extensions",
        description:
          "Extensions let you do more with less code. High level functions with simple API that do pre and post processing for all common standards.",
      }}
      preview={<WriteContractExtensionPreview />}
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
      lang="tsx"
    />
  );
}

function WriteContractRaw() {
  return (
    <CodeExample
      header={{
        title: "Write data to blockchain",
        description:
          "Send transactions with the connected wallet. Type safe functions and hooks to send contracts call or raw transaction.",
      }}
      preview={<WriteContractRawPreview />}
      code={`import { getContract, prepareContractCall, toUnits } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const tw_coin = getContract({
  address: "0xACf072b740a23D48ECd302C9052fbeb3813b60a6",
  chain: sepolia,
  client: THIRDWEB_CLIENT,
});

// Claim some test tokens from the above example!

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
    />
  );
}

function WatchEvent() {
  return (
    <CodeExample
      header={{
        title: "Listen to blockchain events",
        description:
          "Subscribe to any contract event. Auto polling hooks and functions with type safe event extensions for all common standards.",
      }}
      preview={<WatchEventPreview />}
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
    />
  );
}
