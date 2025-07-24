import {
  ArrowLeftRightIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Link from "next/link";
import type { Project } from "@/api/projects";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeServer } from "@/components/ui/code/code.server";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { DotNetIcon } from "@/icons/brand-icons/DotNetIcon";
import { GithubIcon } from "@/icons/brand-icons/GithubIcon";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "@/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "@/icons/brand-icons/UnrealIcon";
import { ContractIcon } from "@/icons/ContractIcon";
import { InsightIcon } from "@/icons/InsightIcon";
import { PayIcon } from "@/icons/PayIcon";
import { ClientIDSection } from "./ClientIDSection";
import { IntegrateAPIKeyCodeTabs } from "./IntegrateAPIKeyCodeTabs";
import { SecretKeySection } from "./SecretKeySection";

export function ProjectFTUX(props: { project: Project; teamSlug: string }) {
  return (
    <div className="flex flex-col gap-10">
      <IntegrateAPIKeySection
        project={props.project}
        teamSlug={props.teamSlug}
      />
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

function IntegrateAPIKeySection({
  project,
  teamSlug,
}: {
  project: Project;
  teamSlug: string;
}) {
  const secretKeyMasked = project.secretKeys[0]?.masked;
  const clientId = project.publishableKey;

  return (
    <section>
      <h2 className="mb-3 font-semibold text-xl tracking-tight">
        Integrate API key
      </h2>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-6 ">
          <ClientIDSection clientId={clientId} />
          {secretKeyMasked && (
            <SecretKeySection
              project={project}
              secretKeyMasked={secretKeyMasked}
            />
          )}
        </div>

        <div className="h-5" />
        <IntegrationCodeExamples project={project} teamSlug={teamSlug} />
      </div>
    </section>
  );
}

function IntegrationCodeExamples(props: {
  project: Project;
  teamSlug: string;
}) {
  return (
    <IntegrateAPIKeyCodeTabs
      tabs={{
        dotnet: (
          <div className="flex flex-col gap-3">
            <CodeServer
              className="bg-background"
              code={dotNotCodeExample(props.project)}
              lang="csharp"
            />
            <Alert className="bg-background" variant="info">
              <CircleAlertIcon className="size-5" />
              <AlertTitle>
                Configure your app's bundle ID in "Allowed Bundle IDs" in
                Project
              </AlertTitle>
              <AlertDescription className="leading-loose">
                Go to{" "}
                <UnderlineLink
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
                  target="_blank"
                >
                  Project settings
                </UnderlineLink>{" "}
                and add your app's bundle ID to the "Allowed Bundle IDs" list.
              </AlertDescription>
            </Alert>
          </div>
        ),
        react: (
          <CodeServer
            className="bg-background"
            code={reactCodeExample(props.project)}
            lang="ts"
          />
        ),
        "react-native": (
          <CodeServer
            className="bg-background"
            code={reactCodeExample(props.project)}
            lang="ts"
          />
        ),
        ts: (
          <CodeServer
            className="bg-background"
            code={typescriptCodeExample(props.project)}
            lang="ts"
          />
        ),
        unity: (
          <Alert className="bg-background" variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>
              Configure Client ID in Thirdweb Manager prefab
            </AlertTitle>
            <AlertDescription className="leading-loose">
              Configure "Client ID" and "Bundle ID" in{" "}
              <UnderlineLink
                href="https://portal.thirdweb.com/unity/v5/thirdwebmanager"
                rel="noopener noreferrer"
                target="_blank"
              >
                Thirdweb Manager prefab
              </UnderlineLink>
              <span className="block text-sm">
                Make sure to configure your app's bundle ID in "Allowed Bundle
                IDs" in{" "}
                <UnderlineLink
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Project settings
                </UnderlineLink>
              </span>
            </AlertDescription>
          </Alert>
        ),
        unreal: (
          <Alert className="bg-background" variant="info">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>
              Configure Client ID in Thirdweb Unreal Plugin{" "}
            </AlertTitle>
            <AlertDescription className="leading-loose">
              Configure "Client ID" and "Bundle ID" in{" "}
              <UnderlineLink
                href="https://portal.thirdweb.com/unreal-engine/getting-started"
                rel="noopener noreferrer"
                target="_blank"
              >
                thirdweb plugin settings
              </UnderlineLink>
              <span className="block text-sm">
                Make sure to configure your app's bundle ID in "Allowed Bundle
                IDs" in{" "}
                <UnderlineLink
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Project settings
                </UnderlineLink>
              </span>
            </AlertDescription>
          </Alert>
        ),
      }}
    />
  );
}

const typescriptCodeExample = (project: Project) => `\
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  // use clientId for client side usage
  clientId: "${project.publishableKey}",
  // use secretKey for server side usage
  secretKey: "${project.secretKeys[0]?.masked}", // replace this with full secret key
});`;

const reactCodeExample = (project: Project) => `\
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId: "${project.publishableKey}",
});`;

const dotNotCodeExample = (project: Project) => `\
using Thirdweb;

// For web applications
var client = ThirdwebClient.Create(clientId: "${project.publishableKey}");

// For native applications - Replace "yourBundleId" with your app's bundle ID
var client = ThirdwebClient.Create(clientId: "${project.publishableKey}", bundleId: "yourBundleId");

// For backend applications (Note: below shown secret key is not the full secret key)
var client = ThirdwebClient.Create(secretKey: "${project.secretKeys[0]?.masked}");`;

// products section ------------------------------------------------------------

function ProductsSection(props: { teamSlug: string; projectSlug: string }) {
  const products: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      description:
        "Scale your application with a backend server to read, write, and deploy contracts at production-grade.",
      href: `/team/${props.teamSlug}/${props.projectSlug}/transactions`,
      icon: ArrowLeftRightIcon,
      title: "Transactions",
    },
    {
      description:
        "Deploy your own contracts or leverage existing solutions for onchain implementation",
      href: `/team/${props.teamSlug}/${props.projectSlug}/contracts`,
      icon: ContractIcon,
      title: "Contracts",
    },
    {
      description:
        "Add indexing capabilities to retrieve real-time onchain data",
      href: `/team/${props.teamSlug}/${props.projectSlug}/insight`,
      icon: InsightIcon,
      title: "Insight",
    },
    {
      description:
        "Bridge, swap, and purchase cryptocurrencies with any fiat options or tokens via cross-chain routing",
      href: `/team/${props.teamSlug}/${props.projectSlug}/payments`,
      icon: PayIcon,
      title: "Payments",
    },
  ];

  return (
    <div className="">
      <h2 className="mb-0.5 font-semibold text-xl tracking-tight">
        Complete your full-stack application
      </h2>
      <p className="text-muted-foreground">
        Tools to build frontend, backend, and onchain with built-in
        infrastructure and analytics.
      </p>

      <div className="h-4" />

      {/* Feature Cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            description={product.description}
            href={product.href}
            icon={product.icon}
            key={product.title}
            title={product.title}
          />
        ))}
      </section>
    </div>
  );
}

function ProductCard(props: {
  title: string;
  description: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <div className="relative flex flex-col rounded-lg border bg-card p-4 hover:border-active-border">
      <div className="mb-3 flex size-9 items-center justify-center rounded-full border p-1">
        <props.icon className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        <Link className="before:absolute before:inset-0" href={props.href}>
          {props.title}
        </Link>
      </h3>
      <p className="text-muted-foreground text-sm">{props.description}</p>
    </div>
  );
}

// sdk section ------------------------------------------------------------

type SDKCardProps = {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  trackingLabel: string;
};

const sdks: SDKCardProps[] = [
  {
    href: "https://portal.thirdweb.com/sdk/typescript",
    icon: TypeScriptIcon,
    name: "TypeScript",
    trackingLabel: "typescript",
  },
  {
    href: "https://portal.thirdweb.com/react/v5",
    icon: ReactIcon,
    name: "React",
    trackingLabel: "react",
  },
  {
    href: "https://portal.thirdweb.com/react-native/v5",
    icon: ReactIcon,
    name: "React Native",
    trackingLabel: "react_native",
  },
  {
    href: "https://portal.thirdweb.com/unity/v5",
    icon: UnityIcon,
    name: "Unity",
    trackingLabel: "unity",
  },
  {
    href: "https://portal.thirdweb.com/unreal-engine",
    icon: UnrealIcon,
    name: "Unreal Engine",
    trackingLabel: "unreal",
  },
  {
    href: "https://portal.thirdweb.com/dotnet",
    icon: DotNetIcon,
    name: ".NET",
    trackingLabel: "dotnet",
  },
];

function SDKSection() {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-xl tracking-tight">Client SDKs</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sdks.map((sdk) => (
          <SDKCard
            href={sdk.href}
            icon={sdk.icon}
            key={sdk.name}
            name={sdk.name}
            trackingLabel={sdk.trackingLabel}
          />
        ))}
      </div>
    </section>
  );
}

function SDKCard(props: SDKCardProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border bg-card p-4 hover:border-active-border">
      <div className="flex size-9 items-center justify-center rounded-full border">
        <props.icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-base">
          <Link
            className="before:absolute before:inset-0"
            href={props.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {props.name}
          </Link>
        </p>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          View Docs
          <ExternalLinkIcon className="size-3" />
        </p>
      </div>
    </div>
  );
}

// starter kits section ------------------------------------------------------------

type StartedKitCardProps = {
  name: string;
  href: string;
  trackingLabel: string;
};

const startedKits: StartedKitCardProps[] = [
  {
    href: "https://github.com/thirdweb-example/next-starter",
    name: "Next Starter",
    trackingLabel: "next_starter",
  },
  {
    href: "https://github.com/thirdweb-example/vite-starter",
    name: "Vite Starter",
    trackingLabel: "vite_starter",
  },
  {
    href: "https://github.com/thirdweb-example/expo-starter",
    name: "Expo Starter",
    trackingLabel: "expo_starter",
  },
  {
    href: "https://github.com/thirdweb-example/node-starter",
    name: "Node Starter",
    trackingLabel: "node_starter",
  },
];

function StarterKitsSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-xl tracking-tight">Starter Kits</h2>
        <Link
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          href="https://github.com/thirdweb-example"
          rel="noopener noreferrer"
          target="_blank"
        >
          View all <ChevronRightIcon className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {startedKits.map((kit) => (
          <StarterKitCard
            href={kit.href}
            key={kit.name}
            name={kit.name}
            trackingLabel={kit.trackingLabel}
          />
        ))}
      </div>
    </section>
  );
}

function StarterKitCard(props: StartedKitCardProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-lg border bg-card p-4 hover:border-active-border">
      <div className="flex size-9 items-center justify-center rounded-full border">
        <GithubIcon className="size-4 text-muted-foreground" />
      </div>

      <div className="flex flex-col gap-0.5">
        <Link
          className="before:absolute before:inset-0"
          href={props.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {props.name}
        </Link>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          View Repo
          <ExternalLinkIcon className="size-3" />
        </p>
      </div>
    </div>
  );
}
