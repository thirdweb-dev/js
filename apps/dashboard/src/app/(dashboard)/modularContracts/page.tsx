import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "thirdweb Hex / Decimal Converter",
  description: "Convert between hexadecimal and decimal numbers.",
};

const ContractCard = ({ title, href, description }: { title: string, href: string, description: string }) => {
  return (
    <Link href={href} className="min-h-[150px] w-[300px] p-6 border border-border relative rounded-lg flex flex-col gap-y-4">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p>{description}</p>
    </Link>
  )
}

const options = [
  {
    title: "Owner only mint",
    description: "Mint a token to the owner of the contract",
    href: "deployer.thirdweb.eth/ModularTokenERC721"
  },
  {
    title: "Allowlist mint",
    description: "Mint a token with overrides to the conditions",
    href: "deployer.thirdweb.eth/ModularDropERC721"
  },
  {
    title: "Open Mint",
    description: "Public minting with no overrides",
    href: "deployer.thirdweb.eth/ModularDropERC721"
  },
  {
    title: "Signature Mint",
    description: "Mint a token with a signature",
    href: "deployer.thirdweb.eth/ModularTokenERC721"
  },
]

export default async function Page() {
  return (
    <section className="flex flex-col h-full gap-8">
      <h1 className="text-3xl font-bold">Select your method of minting</h1>

      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <ContractCard key={option.title} {...option} />
        ))}
      </div>
    </section>
  )
}
