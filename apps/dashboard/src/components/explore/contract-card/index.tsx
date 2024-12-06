import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { moduleToBase64 } from "app/(dashboard)/published-contract/utils/module-base-64";
import { replaceDeployerAddress } from "lib/publisher-utils";
import { RocketIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { fetchPublishedContractVersion } from "../../contract-components/fetch-contracts-with-versions";
import { ContractPublisher } from "../publisher";

interface ContractCardProps {
  publisher: string;
  contractId: string;
  titleOverride?: string;
  descriptionOverride?: string;
  version?: string;
  tracking?: {
    source: string;
    itemIndex: `${number}`;
  };
  isBeta: boolean | undefined;
  // for modular contracts to show the modules in the card
  // publisher and moduleId are required
  // version is optional
  // if version is not provided, it will default to "latest"
  modules?: {
    publisher: string;
    moduleId: string;
    version?: string;
  }[];
}

function getContractUrl(
  {
    version,
    publisher,
    contractId,
    titleOverride,
    modules = [],
  }: {
    publisher: string;
    contractId: string;
    version?: string;
    titleOverride?: string;
    modules?: {
      publisher: string;
      moduleId: string;
      version?: string;
    }[];
  },
  isDeploy?: true,
) {
  let pathName = "";
  if (version !== "latest") {
    pathName = `/${publisher}/${contractId}/${version}`;
  } else {
    pathName = `/${publisher}/${contractId}`;
  }
  if (isDeploy) {
    pathName += "/deploy";
  }
  const moudleUrl = new URLSearchParams();

  for (const m of modules) {
    moudleUrl.append("module", moduleToBase64(m));
  }

  if (titleOverride) {
    moudleUrl.append("displayName", titleOverride);
  }

  pathName += moudleUrl.toString() ? `?${moudleUrl.toString()}` : "";
  return replaceDeployerAddress(pathName);
}

export async function ContractCard({
  publisher,
  contractId,
  titleOverride,
  descriptionOverride,
  version = "latest",
  tracking,
  modules = [],
  isBeta,
}: ContractCardProps) {
  const client = getThirdwebClient();
  const publishedContractResult = await fetchPublishedContractVersion(
    publisher,
    contractId,
    version,
  ).catch(() => null);

  if (!publishedContractResult) {
    return null;
  }

  const auditLink = resolveSchemeWithErrorHandler({
    uri: publishedContractResult.audit,
    client,
  });

  return (
    <article
      className={
        "relative flex min-h-[220px] flex-col rounded-lg border border-border bg-muted/50 p-4 hover:bg-muted"
      }
    >
      <TrackedLinkTW
        className="absolute inset-0 z-0 cursor-pointer"
        href={getContractUrl({
          publisher,
          contractId,
          version,
          modules,
          titleOverride,
        })}
        category="contract_card"
        label={contractId}
        trackingProps={{
          publisher,
          contractId,
          version,
          ...(tracking || {}),
        }}
      />

      {/* Audited + Version  + Tags */}
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5">
          {/* Audited */}
          {auditLink && (
            <>
              <Link
                target="_blank"
                className="relative z-1 flex items-center gap-1 font-medium text-sm text-success-text hover:underline"
                href={auditLink}
              >
                <ShieldCheckIcon className="size-4" />
                Audited
              </Link>
              <div className="size-1 rounded-full bg-muted-foreground/50" />
            </>
          )}

          {/* Version */}

          {publishedContractResult.version && (
            <p className="font-medium text-muted-foreground text-sm">
              v{publishedContractResult.version}
            </p>
          )}
        </div>

        {/* Tags */}
        {isBeta ? (
          <Badge className="border-[#a21caf] bg-[linear-gradient(154deg,#d946ef,#9333ea)] px-[8px] py-[3px] text-white dark:border-[#86198f] dark:bg-[linear-gradient(154deg,#4a044e,#2e1065)]">
            Beta
          </Badge>
        ) : null}
      </div>

      <div className="h-3.5" />

      {/* Title */}
      <h3 className="font-semibold text-lg tracking-tight">
        {(
          titleOverride ||
          publishedContractResult.displayName ||
          publishedContractResult.name
        ).replace("[Beta]", "")}
      </h3>

      {/* Desc */}
      <p className="mt-1 text-muted-foreground text-sm leading-5">
        {descriptionOverride || publishedContractResult.description}
      </p>

      {modules.length ? (
        <div className="mt-auto flex flex-row flex-wrap gap-1 pt-3">
          {modules.slice(0, 2).map((m) => (
            <Badge variant="outline" key={m.publisher + m.moduleId + m.version}>
              {m.moduleId.split("ERC")[0]}
            </Badge>
          ))}
          {modules.length > 2 ? (
            <Badge variant="outline">+{modules.length - 2}</Badge>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "relative z-1 flex justify-between gap-2 pt-3",
          !modules?.length && "mt-auto",
        )}
      >
        {publishedContractResult.publisher && (
          <ContractPublisher addressOrEns={publishedContractResult.publisher} />
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="primary"
            size="sm"
            className="relative z-10 h-auto gap-1.5 px-2.5 py-1.5 text-xs"
            asChild
          >
            <Link
              href={getContractUrl(
                {
                  publisher,
                  contractId,
                  version,
                  modules,
                },
                true,
              )}
            >
              <RocketIcon className="size-3" />
              Deploy
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ContractCardSkeleton() {
  return <Skeleton className="h-[218px] border" />;
}
