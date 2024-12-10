import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import {
  ArrowUpDownIcon,
  CircleDotDashedIcon,
  PlusIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthTokenWalletAddress } from "../../../../api/lib/getAuthToken";
import type { ThirdwebBlueprintSlug } from "./[blueprint_slug]/getBlueprintMetadata";

export default async function Page(props: {
  params: Promise<{ team_slug: string; project_slug: string }>;
}) {
  const params = await props.params;
  const accountAddress = await getAuthTokenWalletAddress();

  if (!accountAddress) {
    const { team_slug, project_slug } = await props.params;
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${team_slug}/${project_slug}/insight`)}`,
    );
  }

  return (
    <div className="flex grow flex-col">
      <div className="border-border border-b py-10">
        <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-semibold text-2xl tracking-tight sm:text-3xl">
            Insight
          </h1>
          <ToolTipLabel label="Coming Soon">
            <Button className="gap-2" disabled>
              <PlusIcon className="size-4" />
              Add Blueprint <span className="lg:hidden"> (Coming Soon) </span>
            </Button>
          </ToolTipLabel>
        </div>
      </div>

      <div className="container py-8">
        <h2 className="mb-3 font-semibold text-lg tracking-tight">
          Explore Blueprints
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => {
            return (
              <BlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                teamSlug={params.team_slug}
                projectSlug={params.project_slug}
                icon={blueprint.icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type Blueprint = {
  id: string;
  name: string;
  slug: ThirdwebBlueprintSlug;
  description: string;
  icon: React.FC<{ className?: string }>;
};

const blueprints: Blueprint[] = [
  {
    id: "1",
    name: "Transactions",
    slug: "transactions",
    description: "Query transaction data",
    icon: ArrowUpDownIcon,
  },
  {
    id: "2",
    name: "Events",
    slug: "events",
    description: "Query event data",
    icon: ZapIcon,
  },
  {
    id: "3",
    name: "Tokens",
    slug: "erc20-tokens",
    description: "Query ERC-20, ERC-721, and ERC-1155 tokens",
    icon: CircleDotDashedIcon,
  },
];

function BlueprintCard(props: {
  blueprint: Blueprint;
  teamSlug: string;
  projectSlug: string;
  icon: React.FC<{ className?: string }>;
}) {
  const { blueprint } = props;
  return (
    <div
      key={blueprint.id}
      className="relative rounded-lg border border-border bg-muted/50 p-4 hover:bg-muted/70"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl border p-1">
          <div className="rounded-lg border bg-muted p-1">
            <props.icon className="size-5 text-muted-foreground" />
          </div>
        </div>

        <div>
          <Link
            className="group static before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-0"
            href={`/team/${props.teamSlug}/${props.projectSlug}/insight/${blueprint.slug}`}
          >
            <h2 className="font-medium text-base">{blueprint.name}</h2>
          </Link>

          <p className="text-muted-foreground text-sm">
            {blueprint.description}
          </p>
        </div>
      </div>
    </div>
  );
}
