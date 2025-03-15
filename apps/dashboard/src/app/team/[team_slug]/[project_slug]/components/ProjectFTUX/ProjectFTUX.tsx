import type { Project } from "@/api/projects";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeServer } from "@/components/ui/code/code.server";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import {
  ChevronRightIcon,
  CircleAlertIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { ContractIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/ContractIcon";
import { EngineIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/EngineIcon";
import { InsightIcon } from "../../../../../(dashboard)/(chain)/components/server/icons/InsightIcon";
import { DotNetIcon } from "../../../../../../components/icons/brand-icons/DotNetIcon";
import { GithubIcon } from "../../../../../../components/icons/brand-icons/GithubIcon";
import { ReactIcon } from "../../../../../../components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "../../../../../../components/icons/brand-icons/TypeScriptIcon";
import { UnityIcon } from "../../../../../../components/icons/brand-icons/UnityIcon";
import { UnrealIcon } from "../../../../../../components/icons/brand-icons/UnrealIcon";
import { NebulaIcon } from "../../../../../nebula-app/(app)/icons/NebulaIcon";
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
        teamSlug={props.teamSlug}
        projectSlug={props.project.slug}
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
          <div>
            <h3>Client ID</h3>
            <p className="mb-2 text-muted-foreground text-sm">
              Identifies your application.
            </p>

            <CopyTextButton
              textToCopy={clientId}
              className="!h-auto w-full max-w-[350px] justify-between truncate bg-background px-3 py-3 font-mono"
              textToShow={clientId}
              copyIconPosition="right"
              tooltip="Copy Client ID"
            />
          </div>

          {secretKeyMasked && (
            <SecretKeySection
              secretKeyMasked={secretKeyMasked}
              projectId={project.id}
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
        ts: (
          <CodeServer
            code={typescriptCodeExample(props.project)}
            lang="ts"
            className="bg-background"
          />
        ),
        react: (
          <CodeServer
            code={reactCodeExample(props.project)}
            lang="ts"
            className="bg-background"
          />
        ),
        "react-native": (
          <CodeServer
            code={reactCodeExample(props.project)}
            lang="ts"
            className="bg-background"
          />
        ),
        unity: (
          <Alert variant="info" className="bg-background">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>
              Configure Client ID in Thirdweb Manager prefab
            </AlertTitle>
            <AlertDescription className="leading-loose">
              Configure "Client ID" and "Bundle ID" in{" "}
              <UnderlineLink
                href="https://portal.thirdweb.com/unity/v5/thirdwebmanager"
                target="_blank"
              >
                Thirdweb Manager prefab
              </UnderlineLink>
              <span className="block text-sm">
                Make sure to configure your app's bundle ID in "Allowed Bundle
                IDs" in{" "}
                <UnderlineLink
                  target="_blank"
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
                >
                  Project settings
                </UnderlineLink>
              </span>
            </AlertDescription>
          </Alert>
        ),
        dotnet: (
          <div className="flex flex-col gap-3">
            <CodeServer
              code={dotNotCodeExample(props.project)}
              lang="csharp"
              className="bg-background"
            />
            <Alert variant="info" className="bg-background">
              <CircleAlertIcon className="size-5" />
              <AlertTitle>
                Configure your app's bundle ID in "Allowed Bundle IDs" in
                Project
              </AlertTitle>
              <AlertDescription className="leading-loose">
                Go to{" "}
                <UnderlineLink
                  target="_blank"
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
                >
                  Project settings
                </UnderlineLink>{" "}
                and add your app's bundle ID to the "Allowed Bundle IDs" list.
              </AlertDescription>
            </Alert>
          </div>
        ),
        unreal: (
          <Alert variant="info" className="bg-background">
            <CircleAlertIcon className="size-5" />
            <AlertTitle>
              Configure Client ID in Thirdweb Unreal Plugin{" "}
            </AlertTitle>
            <AlertDescription className="leading-loose">
              Configure "Client ID" and "Bundle ID" in{" "}
              <UnderlineLink
                href="https://portal.thirdweb.com/unreal-engine/getting-started"
                target="_blank"
              >
                thirdweb plugin settings
              </UnderlineLink>
              <span className="block text-sm">
                Make sure to configure your app's bundle ID in "Allowed Bundle
                IDs" in{" "}
                <UnderlineLink
                  target="_blank"
                  href={`/team/${props.teamSlug}/${props.project.slug}/settings`}
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

function ProductsSection(props: {
  teamSlug: string;
  projectSlug: string;
}) {
  const products: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.FC<{ className?: string }>;
    trackingLabel: string;
  }> = [
    {
      title: "Engine",
      description:
        "Scale your application with a backend server to read, write, and deploy contracts at production-grade.",
      href: `/team/${props.teamSlug}/~/engine`,
      icon: EngineIcon,
      trackingLabel: "engine",
    },
    {
      title: "Contracts",
      description:
        "Deploy your own contracts or leverage existing solutions for onchain implementation",
      href: `/team/${props.teamSlug}/${props.projectSlug}/contracts`,
      icon: ContractIcon,
      trackingLabel: "contracts",
    },
    {
      title: "Insight",
      description:
        "Add indexing capabilities to retrieve real-time onchain data",
      href: `/team/${props.teamSlug}/${props.projectSlug}/insight`,
      icon: InsightIcon,
      trackingLabel: "insight",
    },
    {
      title: "Nebula",
      description:
        "Integrate a blockchain AI model to improve your users insight into your application and the blockchain",
      href: `/team/${props.teamSlug}/~/nebula`,
      icon: NebulaIcon,
      trackingLabel: "nebula",
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
            key={product.title}
            title={product.title}
            description={product.description}
            href={product.href}
            icon={product.icon}
            trackingLabel={product.trackingLabel}
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
  trackingLabel: string;
}) {
  return (
    <div className="relative flex flex-col rounded-lg border bg-card p-4 hover:border-active-border">
      <div className="mb-3 flex size-9 items-center justify-center rounded-full border p-1">
        <props.icon className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        <TrackedLinkTW
          href={props.href}
          target="_blank"
          className="before:absolute before:inset-0"
          category="project-ftux"
          label={props.trackingLabel}
        >
          {props.title}
        </TrackedLinkTW>
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
    name: "TypeScript",
    href: "https://portal.thirdweb.com/sdk/typescript",
    icon: TypeScriptIcon,
    trackingLabel: "typescript",
  },
  {
    name: "React",
    href: "https://portal.thirdweb.com/react/v5",
    icon: ReactIcon,
    trackingLabel: "react",
  },
  {
    name: "React Native",
    href: "https://portal.thirdweb.com/react-native/v5",
    icon: ReactIcon,
    trackingLabel: "react_native",
  },
  {
    name: "Unity",
    href: "https://portal.thirdweb.com/unity/v5",
    icon: UnityIcon,
    trackingLabel: "unity",
  },
  {
    name: "Unreal Engine",
    href: "https://portal.thirdweb.com/unreal-engine",
    icon: UnrealIcon,
    trackingLabel: "unreal",
  },
  {
    name: ".NET",
    href: "https://portal.thirdweb.com/dotnet",
    icon: DotNetIcon,
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
            key={sdk.name}
            name={sdk.name}
            href={sdk.href}
            icon={sdk.icon}
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
          <TrackedLinkTW
            href={props.href}
            className="before:absolute before:inset-0"
            target="_blank"
            category="project-ftux"
            label={props.trackingLabel}
          >
            {props.name}
          </TrackedLinkTW>
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
    name: "Next Starter",
    href: "https://github.com/thirdweb-example/next-starter",
    trackingLabel: "next_starter",
  },
  {
    name: "Vite Starter",
    href: "https://github.com/thirdweb-example/vite-starter",
    trackingLabel: "vite_starter",
  },
  {
    name: "Expo Starter",
    href: "https://github.com/thirdweb-example/expo-starter",
    trackingLabel: "expo_starter",
  },
  {
    name: "Node Starter",
    href: "https://github.com/thirdweb-example/node-starter",
    trackingLabel: "node_starter",
  },
];

function StarterKitsSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-xl tracking-tight">Starter Kits</h2>
        <TrackedLinkTW
          href="https://github.com/thirdweb-example"
          target="_blank"
          category="project-ftux"
          label="view_all_templates"
          className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          View all <ChevronRightIcon className="size-3" />
        </TrackedLinkTW>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {startedKits.map((kit) => (
          <StarterKitCard
            key={kit.name}
            name={kit.name}
            href={kit.href}
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
        <TrackedLinkTW
          href={props.href}
          target="_blank"
          category="project-ftux"
          label={props.trackingLabel}
          className="before:absolute before:inset-0"
        >
          {props.name}
        </TrackedLinkTW>
        <p className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
          View Repo
          <ExternalLinkIcon className="size-3" />
        </p>
      </div>
    </div>
  );
}
