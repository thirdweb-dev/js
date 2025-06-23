import Link from "next/link";
import { ReactIcon } from "@/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "@/icons/brand-icons/TypeScriptIcon";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

export function BuildYourApp(props: {
  contractAddress: string;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const codePath = buildContractPagePath({
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contractAddress,
    projectMeta: props.projectMeta,
    subpath: "/code",
  });

  return (
    <div className="relative flex flex-col justify-between gap-4 rounded-lg border bg-card p-6 hover:border-active-border lg:flex-row">
      {/* left */}
      <div className="max-w-sm">
        <h2 className="mb-2 font-semibold text-xl leading-none tracking-tight">
          Build your app
        </h2>
        <Link
          className="block text-balance text-muted-foreground text-sm before:absolute before:inset-0"
          href={codePath}
        >
          Learn more about how you can use thirdweb tools to build apps on top
          of this contract
        </Link>{" "}
      </div>

      {/* right */}
      <div className="flex items-center justify-end gap-3">
        {[TypeScriptIcon, ReactIcon].map((Icon, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: this is stable
            <div className="rounded-full border bg-background p-3" key={i}>
              <Icon className="size-5 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
