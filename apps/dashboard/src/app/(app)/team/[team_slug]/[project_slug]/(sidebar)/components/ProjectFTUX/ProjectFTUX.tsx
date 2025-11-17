import { Button } from "@workspace/ui/components/button";
import { CodeServer } from "@workspace/ui/components/code/code.server";
import {
  ArrowUpRightIcon,
  BotIcon,
  ChevronRightIcon,
  CoinsIcon,
  DoorOpenIcon,
} from "lucide-react";
import Link from "next/link";
import type { Project } from "@/api/project/projects";
import { BridgeIcon } from "@/icons/BridgeIcon";
import { DotNetIcon } from "@/icons/brand-icons/DotNetIcon";
import { ExpoIcon } from "@/icons/brand-icons/ExpoIcon";
import { NextjsIcon } from "@/icons/brand-icons/NextjsIcon";
import { NodeJSIcon } from "@/icons/brand-icons/NodeJSIcon";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "@/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "@/icons/brand-icons/UnrealIcon";
import { ViteIcon } from "@/icons/brand-icons/ViteIcon";
import { PayIcon } from "@/icons/PayIcon";
import { WalletProductIcon } from "@/icons/WalletProductIcon";
import { ClientIDSection } from "./ClientIDSection";
import { CodeShowcase } from "./CodeSelector";
import { SecretKeySection } from "./SecretKeySection";

export function ProjectFTUX(props: {
  project: Project;
  teamSlug: string;
  projectWalletSection: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-14">
      <IntegrateAPIKeySection project={props.project} />
      {props.projectWalletSection}
      <GetStartedSection project={props.project} />
      <ProductsSection
        projectSlug={props.project.slug}
        teamSlug={props.teamSlug}
      />
      <SDKSection />
      <StarterKitsSection />
    </div>
  );
}

// Integrate API key section ------------------------------------------------------------

function IntegrateAPIKeySection({ project }: { project: Project }) {
  const secretKeyMasked = project.secretKeys[0]?.masked;
  const clientId = project.publishableKey;

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <h2 className="mb-1 font-semibold text-xl tracking-tight">API Keys</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Your API key is used to authenticate and integrate your application.
        </p>
        <Button
          variant="outline"
          className="bg-card rounded-lg gap-2"
          size="sm"
          asChild
        >
          <Link
            href="https://portal.thirdweb.com/account/api-keys"
            target="_blank"
          >
            Learn more about API keys
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-6 ">
          <ClientIDSection clientId={clientId} />
          {secretKeyMasked && (
            <SecretKeySection
              project={project}
              secretKeyMasked={secretKeyMasked}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function GetStartedSection({ project }: { project: Project }) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <h2 className="mb-1 font-semibold text-xl tracking-tight">
          Get Started
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Send a test transaction using your project wallet
        </p>

        <Button
          variant="outline"
          className="bg-card rounded-lg gap-2"
          size="sm"
          asChild
        >
          <Link href="https://portal.thirdweb.com/reference" target="_blank">
            View API Reference
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <CodeShowcase
        title="POST /v1/auth/initiate"
        tabs={[
          {
            label: "Curl",
            code: (
              <CodeServer
                code={curlCodeExample(project)}
                lang="bash"
                className="border-t-0 rounded-t-none"
              />
            ),
          },
          {
            label: "JavaScript",
            code: (
              <CodeServer
                code={fetchJSCodeExample(project)}
                lang="js"
                className="border-t-0 rounded-t-none"
              />
            ),
          },
          {
            label: "Python",
            code: (
              <CodeServer
                code={pythonCodeExample(project)}
                lang="python"
                className="border-t-0 rounded-t-none"
              />
            ),
          },
        ]}
      />
    </section>
  );
}

const curlCodeExample = (project: Project): string => `\
curl https://api.thirdweb.com/v1/transactions \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --header 'x-secret-key: ${project.secretKeys[0]?.masked ?? "<YOUR_SECRET_KEY>"}' \\
  --data '{
  "chainId": 421614,
  "transactions": [
    {
      "data": "0x",
      "to": "vitalik.eth",
      "value": "0"
    }
  ]
}'
`;

const fetchJSCodeExample = (project: Project): string => `\
fetch("https://api.thirdweb.com/v1/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-secret-key": "${project.secretKeys[0]?.masked ?? "<YOUR_SECRET_KEY>"}",
  },
  body: JSON.stringify({
    chainId: 421614,
    transactions: [
      { data: "0x", to: "vitalik.eth", value: "0" },
    ],
  }),
});
`;

const pythonCodeExample = (project: Project): string => `\
import requests

url = "https://api.thirdweb.com/v1/transactions"
headers = {
  "Content-Type": "application/json",
  "x-secret-key": "${project.secretKeys[0]?.masked ?? "<YOUR_SECRET_KEY>"}",
}
payload = {
  "chainId": 421614,
  "transactions": [
    { "data": "0x", "to": "vitalik.eth", "value": "0" },
  ],
}
response = requests.post(url, headers=headers, json=payload)
result = response.json()
`;

// products section ------------------------------------------------------------

function ProductsSection(props: { teamSlug: string; projectSlug: string }) {
  const products: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      icon: WalletProductIcon,
      title: "Wallets",
      description: "Wallets to read, write and transact",
      href: `/team/${props.teamSlug}/${props.projectSlug}/wallets/user-wallets`,
    },
    {
      icon: BridgeIcon,
      title: "Bridge",
      description: "Swap and bridge tokens",
      href: `/team/${props.teamSlug}/${props.projectSlug}/bridge`,
    },
    {
      icon: PayIcon,
      title: "x402",
      description: "Native internet payments",
      href: `/team/${props.teamSlug}/${props.projectSlug}/x402`,
    },
    {
      icon: DoorOpenIcon,
      title: "Gateway",
      description: "Blockchain connectivity and data access",
      href: `/team/${props.teamSlug}/${props.projectSlug}/gateway/rpc`,
    },
    {
      icon: CoinsIcon,
      title: "Tokens",
      description: "Launch tokens and markets",
      href: `/team/${props.teamSlug}/${props.projectSlug}/tokens`,
    },
    {
      icon: BotIcon,
      title: "AI",
      description: "Read and write onchain via AI agents",
      href: `/team/${props.teamSlug}/${props.projectSlug}/ai`,
    },
  ];

  return (
    <div className="">
      <h2 className="mb-1 font-semibold text-xl tracking-tight">Products</h2>
      <p className="text-muted-foreground text-sm">
        Everything you need to build full-stack applications, games, and agents.
      </p>

      <div className="h-4" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <IconCard
            description={product.description}
            href={product.href}
            icon={product.icon}
            key={product.title}
            name={product.title}
          />
        ))}
      </section>
    </div>
  );
}

// sdk section ------------------------------------------------------------

type IconCardProps = {
  name: string;
  description: string | undefined;
  href: string;
  icon: React.FC<{ className?: string }>;
};

const sdks: IconCardProps[] = [
  {
    href: "https://portal.thirdweb.com/sdk/typescript",
    icon: TypeScriptIcon,
    name: "TypeScript",
    description: undefined,
  },
  {
    href: "https://portal.thirdweb.com/react/v5",
    icon: ReactIcon,
    name: "React",
    description: undefined,
  },
  {
    href: "https://portal.thirdweb.com/react-native/v5",
    icon: ReactIcon,
    name: "React Native",
    description: undefined,
  },
  {
    href: "https://portal.thirdweb.com/unity/v5",
    icon: UnityIcon,
    name: "Unity",
    description: undefined,
  },
  {
    href: "https://portal.thirdweb.com/unreal-engine",
    icon: UnrealIcon,
    name: "Unreal Engine",
    description: undefined,
  },
  {
    href: "https://portal.thirdweb.com/dotnet",
    icon: DotNetIcon,
    name: ".NET",
    description: undefined,
  },
];

function SDKSection() {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-xl tracking-tight">Client SDKs</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sdks.map((sdk) => (
          <IconCard
            href={sdk.href}
            icon={sdk.icon}
            key={sdk.name}
            name={sdk.name}
            description={sdk.description}
          />
        ))}
      </div>
    </section>
  );
}

function IconCard(props: IconCardProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-xl border bg-card p-4 hover:border-active-border">
      <div className="flex items-center justify-center rounded-full border p-2 bg-background">
        <props.icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-base">
          <Link
            className="before:absolute before:inset-0"
            href={props.href}
            target={props.href.startsWith("http") ? "_blank" : undefined}
          >
            {props.name}
          </Link>
        </p>
        {props.description && (
          <p className="text-muted-foreground text-sm">{props.description}</p>
        )}
      </div>
    </div>
  );
}

// starter kits section ------------------------------------------------------------

const startedKits: IconCardProps[] = [
  {
    href: "https://github.com/thirdweb-example/next-starter",
    name: "Next Starter",
    icon: NextjsIcon,
    description: undefined,
  },
  {
    href: "https://github.com/thirdweb-example/vite-starter",
    name: "Vite Starter",
    icon: ViteIcon,
    description: undefined,
  },
  {
    href: "https://github.com/thirdweb-example/expo-starter",
    name: "Expo Starter",
    icon: ExpoIcon,
    description: undefined,
  },
  {
    href: "https://github.com/thirdweb-example/node-starter",
    name: "Node Starter",
    icon: NodeJSIcon,
    description: undefined,
  },
];

function StarterKitsSection() {
  return (
    <section>
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-xl tracking-tight mb-1">
            Starters
          </h2>
          <p className="text-muted-foreground text-sm">
            Kickstart your development process with ready-to-ship repositories.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground shrink-0"
          href="https://github.com/thirdweb-example"
          rel="noopener noreferrer"
          target="_blank"
        >
          View all <ChevronRightIcon className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {startedKits.map((kit) => (
          <IconCard
            href={kit.href}
            icon={kit.icon}
            key={kit.name}
            name={kit.name}
            description={kit.description}
          />
        ))}
      </div>
    </section>
  );
}
