import { ReactIcon } from "components/icons/brand-icons/ReactIcon";
import { TypeScriptIcon } from "components/icons/brand-icons/TypeScriptIcon";
import Link from "next/link";
import type { ProjectMeta } from "../../../../../../team/[team_slug]/[project_slug]/contract/[chainIdOrSlug]/[contractAddress]/types";
import { buildContractPagePath } from "../../_utils/contract-page-path";

export function BuildYourApp(props: {
  contractAddress: string;
  chainSlug: string;
  projectMeta: ProjectMeta | undefined;
}) {
  const codePath = buildContractPagePath({
    projectMeta: props.projectMeta,
    chainIdOrSlug: props.chainSlug,
    contractAddress: props.contractAddress,
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
          href={codePath}
          className="block text-balance text-muted-foreground text-sm before:absolute before:inset-0"
        >
          Learn more about how you can use thirdweb tools to build apps on top
          of this contract
        </Link>{" "}
      </div>

      {/* right */}
      <div className="flex items-center justify-end gap-3">
        {[TypeScriptIcon, ReactIcon].map((Icon, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={i} className="rounded-full border bg-background p-3">
              <Icon className="size-5 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
