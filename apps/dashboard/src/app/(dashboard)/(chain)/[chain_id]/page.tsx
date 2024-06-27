import { ChevronRight, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { InfoCard } from "./components/server/info-card";
import twPublisherImage from "./tw-publisher.png";

type ContractCardInfo = {
  name: string;
  description: string;
  href: string;
};

// currently the metadata is hardcoded - TODO:fetch it

const popularContracts: ContractCardInfo[] = [
  {
    name: "NFT Drop",
    description: "Release collection of unique NFTs for a set price",
    href: "/thirdweb.eth/DropERC721",
  },
  {
    name: "NFT Collection",
    description: "Create a collection of unique NFTs",
    href: "/thirdweb.eth/TokenERC721",
  },
  {
    name: "Edition Drop",
    description: "Release ERC1155 tokens for a set price",
    href: "/thirdweb.eth/DropERC1155",
  },
  {
    name: "Token",
    description: "Create cryptocurrency compliant with ERC20 standard",
    href: "/thirdweb.eth/TokenERC20",
  },
  {
    name: "Edition",
    description: "Create editions of ERC1155 tokens",
    href: "/thirdweb.eth/TokenERC1155",
  },
];

export default async function Page() {
  return (
    <div>
      <InfoCard
        title="thirdweb Contracts"
        links={[
          {
            label: "Learn More",
            href: "https://portal.thirdweb.com/contracts",
          },
        ]}
      >
        <p>End-to-end tools for smart contract development</p>
        <p>
          Trusted, modular smart contracts that can be deployed securely on any
          EVM chain
        </p>
      </InfoCard>

      <div className="h-10" />

      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-2xl tracking-tighter font-semibold">
          Get Started
        </h3>
        <Link
          href="/explore"
          className="text-link-foreground inline-flex items-center gap-1 text-base hover:text-foreground font-medium"
        >
          View All
          <ChevronRight className="size-5" />
        </Link>
      </div>

      <div className="h-3" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {popularContracts.map((c) => {
          return (
            <ContractCard
              key={c.name}
              name={c.name}
              description={c.description}
              href={c.href}
            />
          );
        })}
      </div>
    </div>
  );
}

function ContractCard(props: ContractCardInfo) {
  return (
    <div className="border bg-secondary rounded-xl p-4 hover:bg-muted relative flex flex-col h-full shadow-sm min-h-[200px]">
      <div className="text-success-foreground flex items-center gap-1 mb-4 text-sm font-medium">
        <ShieldCheckIcon className="size-4 text-success-foreground" />
        Audited
      </div>

      <h3 className="text-lg tracking-tight font-semibold text-foreground mb-1">
        <Link
          href={props.href}
          className="before:absolute before:inset-0 before:z-0"
        >
          {props.name}
        </Link>
      </h3>

      <p className="text-base text-muted-foreground mb-5">
        {props.description}
      </p>

      <Link
        className="inline-flex items-center gap-1.5 z-10 relative mt-auto text-muted-foreground hover:text-foreground"
        href="/thirdweb.eth"
      >
        <Image
          src={twPublisherImage}
          alt="thirdweb.eth"
          className="size-4 rounded-full"
        />
        <p className="text-sm">thirdweb.eth</p>
      </Link>
    </div>
  );
}
