"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { moduleToBase64 } from "app/(dashboard)/published-contract/utils/module-base-64";
import { RocketIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import invariant from "tiny-invariant";
import { fetchPublishedContractVersion } from "../../contract-components/fetch-contracts-with-versions";
import { ContractPublisher, replaceDeployerAddress } from "../publisher";

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

export const ContractCard: React.FC<ContractCardProps> = ({
  publisher,
  contractId,
  titleOverride,
  descriptionOverride,
  version = "latest",
  tracking,
  modules = [],
  isBeta,
}) => {
  const client = useThirdwebClient();
  const publishedContractResult = usePublishedContract(
    `${publisher}/${contractId}/${version}`,
  );

  const showSkeleton = publishedContractResult.isPending;

  const auditLink = resolveSchemeWithErrorHandler({
    uri: publishedContractResult.data?.audit,
    client,
  });

  return (
    <article
      className={cn(
        "relative flex min-h-[220px] flex-col rounded-lg border border-border p-4",
        !showSkeleton ? "bg-muted/50 hover:bg-muted" : "pointer-events-none",
      )}
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
          <SkeletonContainer
            skeletonData="0.0.0"
            loadedData={publishedContractResult.data?.version}
            render={(v) => {
              return (
                <p className="font-medium text-muted-foreground text-sm">
                  v{v}
                </p>
              );
            }}
          />
        </div>

        {/* Tags */}
        {isBeta ? (
          <Badge className="border-[#a21caf] bg-[linear-gradient(154deg,#d946ef,#9333ea)] px-[8px] py-[3px] text-white dark:border-[#86198f] dark:bg-[linear-gradient(154deg,#4a044e,#2e1065)]">
            Beta
          </Badge>
        ) : null}
      </div>

      <div className="h-3.5" />

      <SkeletonContainer
        className="inline-block"
        skeletonData="Edition Drop"
        loadedData={
          titleOverride ||
          publishedContractResult.data?.displayName ||
          publishedContractResult.data?.name
        }
        render={(v) => {
          return (
            <h3 className="font-semibold text-lg tracking-tight">
              {v.replace("[Beta]", "")}
            </h3>
          );
        }}
      />

      {publishedContractResult.data ? (
        <p className="mt-1 text-muted-foreground text-sm leading-5">
          {descriptionOverride || publishedContractResult.data?.description}
        </p>
      ) : (
        <div className="mt-1">
          <Skeleton className="h-4 w-[80%]" />
          <div className="h-1" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      )}
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
        <ContractPublisher
          addressOrEns={publishedContractResult.data?.publisher}
          showSkeleton={showSkeleton}
        />

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
};

// data fetching
type PublishedContractId =
  | `${string}/${string}`
  | `${string}/${string}/${string}`;

function usePublishedContract(publishedContractId: PublishedContractId) {
  const [publisher, contractId, version] = publishedContractId.split("/");
  return useQuery({
    queryKey: ["published-contract", { publishedContractId }],
    queryFn: () => {
      invariant(publisher, "publisher is required");
      invariant(contractId, "contractId is required");
      return fetchPublishedContractVersion(publisher, contractId, version);
    },
    enabled: !!publisher || !!contractId,
  });
}
