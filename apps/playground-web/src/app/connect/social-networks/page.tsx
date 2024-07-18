import { CodeExample } from "@/components/code/code-example";
import { LensProfilePreview } from "@/components/social-networks/LensProfilePreview";
import { LensHandlePreview } from "@/components/social-networks/LensHandlePreview";
import { Button } from "@/components/ui/button";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase,
  title: "Social Networks | thirdweb Connect",
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
                Social Networks
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-300 mb-6 font-inter">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem
                incidunt neque id perspiciatis, eos molestias amet, tenetur ab
                unde praesentium ducimus, modi saepe iure commodi reprehenderit.
                Ea architecto unde doloremque?
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
        <LensProfile />
      </section>

      <section className="container px-4 md:px-6 space-y-8">
        <LensHandle />
      </section>
    </main>
  );
}

function LensProfile() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Query Lens profile
        </h2>
        <p className="max-w-[600px]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
          deleniti, ut facere labore rerum, laborum saepe possimus neque a
          repellat in tempore animi quam autem minima. Distinctio praesentium
          odit porro.
        </p>
      </div>

      <CodeExample
        preview={<LensProfilePreview />}
        code={`import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getFullProfile } from "thirdweb/extensions/lens";
          
const profileId = 461662n;

const client = createThirdwebClient({ /*...*/ });

const lensHubContract = getContract({
  address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
  chain: polygon,
  client,
});
const lensHandleContract = getContract({
  address: "0xe7E7EaD361f3AaCD73A61A9bD6C10cA17F38E945",
  chain: polygon,
  client,
});
const tokenHandleRegistryContract = getContract({
  address: "0xD4F2F33680FCCb36748FA9831851643781608844",
  chain: polygon,
  client,
});

const profile = await getFullProfile({
  profileId,
  lensHubContract,
  lensHandleContract,
  tokenHandleRegistryContract,
  includeJoinDate: true,
  client,
});
`}
        lang="tsx"
      />
    </>
  );
}

function LensHandle() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Query Lens handle
        </h2>
        <p className="max-w-[600px]">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum
          deleniti, ut facere labore rerum, laborum saepe possimus neque a
          repellat in tempore animi quam autem minima. Distinctio praesentium
          odit porro.
        </p>
      </div>

      <CodeExample
        preview={<LensHandlePreview />}
        code={`import { createThirdwebClient, getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { getHandleFromProfileId } from "thirdweb/extensions/lens";
          
const profileId = 461662n;

const client = createThirdwebClient({ /*...*/ });

const lensHandleContract = getContract({
  address: "0xe7E7EaD361f3AaCD73A61A9bD6C10cA17F38E945",
  chain: polygon,
  client,
});
const tokenHandleRegistryContract = getContract({
  address: "0xD4F2F33680FCCb36748FA9831851643781608844",
  chain: polygon,
  client,
});

const handle = await getHandleFromProfileId({
  profileId,
  client,
  lensHandleContract,
  tokenHandleRegistryContract,
});
`}
        lang="tsx"
      />
    </>
  );
}
