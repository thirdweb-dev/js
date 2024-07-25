import Link from "next/link";
import { redirect } from "next/navigation";
import { FaReact } from "react-icons/fa";
import { FaUnity } from "react-icons/fa6";
import { SiDotnet, SiSolidity, SiTypescript } from "react-icons/si";
import { getChain } from "../../../utils";
import { InfoCard } from "../components/server/info-card";

type SDKInfo = {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
};

const sdks: SDKInfo[] = [
  {
    name: "TypeScript",
    href: "https://portal.thirdweb.com/typescript/v5",
    icon: SiTypescript,
  },
  {
    name: "React",
    href: "https://portal.thirdweb.com/typescript/v5/react",
    icon: FaReact,
  },
  {
    name: "React Native",
    href: "https://portal.thirdweb.com/typescript/v5/react-native",
    icon: FaReact,
  },
  {
    name: "Unity",
    href: "https://portal.thirdweb.com/unity",
    icon: FaUnity,
  },
  {
    name: "Solidity",
    href: "https://portal.thirdweb.com/contracts/build/overview",
    icon: SiSolidity,
  },
  {
    name: ".NET SDK",
    href: "https://portal.thirdweb.com/dotnet",
    icon: SiDotnet,
  },
];

export default async function Page(props: { params: { chain_id: string } }) {
  const chain = await getChain(props.params.chain_id);
  const enabled = chain.services.find(
    (s) => s.service === "connect-sdk",
  )?.enabled;

  if (!enabled) {
    redirect(`/${props.params.chain_id}`);
  }

  return (
    <div>
      <InfoCard
        title="Connect SDK"
        links={[
          {
            label: "Learn More",
            href: "https://portal.thirdweb.com/connect",
          },
        ]}
      >
        <p>
          Connect is the complete toolkit for connecting every user to your
          application.
        </p>
        <p>
          It features customizable onboarding flows, self-custodial in-app
          wallets, account abstraction, onramps, and more.
        </p>
      </InfoCard>

      <div className="h-10" />

      <h3 className="text-foreground text-3xl tracking-tighter font-semibold">
        Get Started
      </h3>

      <div className="h-3" />

      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {sdks.map((sdk) => {
          return (
            <Link
              key={sdk.name}
              href={sdk.href}
              target="_blank"
              className="border p-4 bg-secondary rounded-lg hover:bg-muted font-medium flex items-center gap-3"
            >
              <sdk.icon className="size-5 text-muted-foreground" />
              {sdk.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
