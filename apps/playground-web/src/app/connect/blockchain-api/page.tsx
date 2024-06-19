import { WatchEventPreview } from "@/components/blockchain-api/WatchEventPreview";
import { CodeExample } from "@/components/code/code-example";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase,
  title: "lorem ipsum",
  description: "lorem ipsum",
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
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem
                libero illo odit id impedit veniam quae hic, blanditiis magni
                architecto nobis fugiat eligendi provident? Dolorum optio nobis
                numquam ex impedit!
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link
                  target="_blank"
                  href="https://portal.thirdweb.com/connect/in-app-wallet/overview"
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
        <WatchEvent />
      </section>
    </main>
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
          provident magni mollitia! Provident, ducimus earum ex mollitia quasi
          ut aut repudiandae quae eius. Sed, officia atque ab quisquam at amet!
        </p>
      </div>

      <CodeExample
        preview={<WatchEventPreview />}
        code={`import { useContractEvents } from "thirdweb/react";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { transferEvent } from "thirdweb/extensions/erc20";

const usdcContractOnBase = getContract({
  address: "0x833...02913",
  chain: base,
  client,
});

function App() {
  // Listen to USDC transfers on Base
  const contractEvents = useContractEvents({
    contract: usdcContractOnBase,
    events: [transferEvent()],
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
