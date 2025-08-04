import { moduleToBase64 } from "app/(app)/(dashboard)/published-contract/utils/module-base-64";
import { RocketIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { fetchPublishedContractVersion } from "@/api/contract/fetch-contracts-with-versions";
import { ClientOnly } from "@/components/blocks/client-only";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { replaceDeployerAddress } from "@/lib/publisher-utils";
import { cn } from "@/lib/utils";
import { resolveSchemeWithErrorHandler } from "@/utils/resolveSchemeWithErrorHandler";
import { ContractPublisher } from "./contract-publisher";

interface ContractCardProps {
  publisher: string;
  contractId: string;
  titleOverride?: string;
  descriptionOverride?: string;
  version?: string;
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
  const moduleUrl = new URLSearchParams();

  for (const m of modules) {
    moduleUrl.append("module", moduleToBase64(m));
  }

  if (titleOverride) {
    moduleUrl.append("displayName", titleOverride);
  }

  pathName += moduleUrl.toString() ? `?${moduleUrl.toString()}` : "";
  return replaceDeployerAddress(pathName);
}

export async function ContractCard({
  publisher,
  contractId,
  titleOverride,
  descriptionOverride,
  version = "latest",
  modules = [],
  isBeta,
}: ContractCardProps) {
  const publishedContractResult = await fetchPublishedContractVersion(
    publisher,
    contractId,
    serverThirdwebClient,
    version,
  ).catch(() => null);

  if (!publishedContractResult) {
    return null;
  }

  const auditLink = resolveSchemeWithErrorHandler({
    client: serverThirdwebClient,
    uri: publishedContractResult.audit,
  });

  return (
    <article
      className={
        "relative flex min-h-[220px] flex-col rounded-lg border border-border bg-card p-4 hover:border-active-border"
      }
    >
      {/* Audited + Version  + Tags */}
      <div className="flex justify-between">
        <div className="flex items-center gap-1.5">
          {/* Audited */}
          {auditLink && !isBeta && (
            <>
              <Link
                className="relative z-1 flex items-center gap-1 font-medium text-sm text-success-text hover:underline"
                href={auditLink}
                rel="noopener noreferrer"
                target="_blank"
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
        <Link
          className="cursor-pointer before:absolute before:inset-0 before:z-0"
          href={getContractUrl({
            contractId,
            modules,
            publisher,
            titleOverride,
            version,
          })}
        >
          {(
            titleOverride ||
            publishedContractResult.displayName ||
            publishedContractResult.name
          ).replace("[Beta]", "")}
        </Link>
      </h3>

      {/* Desc */}
      <p className="mt-1 text-muted-foreground text-sm leading-5">
        {descriptionOverride || publishedContractResult.description}
      </p>

      {modules.length ? (
        <div className="mt-auto flex flex-row flex-wrap gap-1 pt-3">
          {modules.slice(0, 2).map((m) => (
            <Badge key={m.publisher + m.moduleId + m.version} variant="outline">
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
          <ClientOnly ssr={<Skeleton className="size-5 rounded-full" />}>
            <ContractPublisher
              addressOrEns={publishedContractResult.publisher}
              client={getClientThirdwebClient()}
            />
          </ClientOnly>
        )}

        <div className="flex items-center justify-between">
          <Button
            asChild
            className="relative z-10 h-auto gap-1.5 px-2.5 py-1.5 text-xs hover:bg-inverted hover:text-inverted-foreground"
            size="sm"
            variant="outline"
          >
            <Link
              href={getContractUrl(
                {
                  contractId,
                  modules,
                  publisher,
                  version,
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
