import { ReadContractExtensionPreview } from "@/components/blockchain-api/read-contract-extension";
import { ReadContractRawPreview } from "@/components/blockchain-api/read-contract-raw";
import { WatchEventPreview } from "@/components/blockchain-api/watch-event-preview";
import { WriteContractExtensionPreview } from "@/components/blockchain-api/write-contract-extension";
import { WriteContractRawPreview } from "@/components/blockchain-api/write-contract-raw";
import { CodeExample } from "@/components/code/code-example";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase,
  title: "Blockchain API | thirdweb Connect",
  description:
    "Interact with EVM blockchains using thirdweb SDK. Create seamless NFT minting experience. Airdrop tokens to millions of users",
};

export default function Page() {
  return (
    <main className="flex-1 content-center relative py-12 md:py-24 lg:py-32 xl:py-48 space-y-12 md:space-y-24">
      <section className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 min-h-[100%]">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-inter mb-6 text-balance">
                Blockchain API
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Performant, reliable and type safe API to read write to any
                contract on any EVM chain through our RPC Edge endpoints.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/typescript/v5"
                >
                  View docs
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link target="_blank" href="https://thirdweb.com/contact-us">
                  Book a Demo
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full mx-auto my-auto sm:w-full order-first lg:order-last relative flex flex-col space-y-2">
            <div className="max-w-full sm:max-w-[600px]">
              <Image
                src={"/blockchain-api.png"}
                width={600}
                height={400}
                objectFit={"contain"}
                alt=""
                priority={true}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <ReadContractRaw />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <ReadContractExtension />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <WriteContractExtension />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <WriteContractRaw />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <WatchEvent />
      </section>
    </main>
  );
}

function ReadContractRaw() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Query blockchain data
        </h2>
        <p className="max-w-[600px]">
          Read data from any contract or wallet. Type safe functions and hooks
          without needing full ABIs.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}

function ReadContractExtension() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Prebuilt read extensions
        </h2>
        <p className="max-w-[600px]">
          Extensions let you do more with less code. High level functions with
          simple API that do pre and post processing for all common standards.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}

function WriteContractExtension() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Prebuilt write extensions
        </h2>
        <p className="max-w-[600px]">
          Extensions let you do more with less code. High level functions with
          simple API that do pre and post processing for all common standards.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}

function WriteContractRaw() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Write data to blockchain
        </h2>
        <p className="max-w-[600px]">
          Send transactions with the connected wallet. Type safe functions and
          hooks to send contracts call or raw transaction.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}

function WatchEvent() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Listen to blockchain events
        </h2>
        <p className="max-w-[600px]">
          Subscribe to any contract event. Auto polling hooks and functions with
          type safe event extensions for all common standards.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}
