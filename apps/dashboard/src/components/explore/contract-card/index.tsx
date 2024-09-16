import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { thirdwebClient } from "@/constants/client";
import { cn } from "@/lib/utils";
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { moduleToBase64 } from "app/(dashboard)/published-contract/utils/module-base-64";
import { ensQuery } from "components/contract-components/hooks";
import { RocketIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { resolveScheme } from "thirdweb/storage";
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
  const publishedContractResult = usePublishedContract(
    `${publisher}/${contractId}/${version}`,
  );

  const showSkeleton = publishedContractResult.isLoading;

  return (
    <article
      className={cn(
        "min-h-[220px] p-4 border border-border relative rounded-lg flex flex-col",
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
          {publishedContractResult.data?.audit && (
            <>
              <Link
                target="_blank"
                className="text-success-text flex items-center gap-1 text-sm z-1 hover:underline font-medium relative"
                href={resolveScheme({
                  uri: publishedContractResult.data.audit,
                  client: thirdwebClient,
                })}
              >
                <ShieldCheckIcon className="size-4" />
                Audited
              </Link>
              <div className="size-1 bg-muted-foreground/50 rounded-full" />
            </>
          )}

          {/* Version */}
          <SkeletonContainer
            skeletonData={"0.0.0"}
            loadedData={publishedContractResult.data?.version}
            render={(v) => {
              return (
                <p className="text-muted-foreground text-sm font-medium">
                  v{v}
                </p>
              );
            }}
          />
        </div>

        {/* Tags */}
        {isBeta ? (
          <Badge className="border-[#a21caf] dark:border-[#86198f] text-white  dark:bg-[linear-gradient(154deg,#4a044e,#2e1065)] bg-[linear-gradient(154deg,#d946ef,#9333ea)] py-[3px] px-[8px]">
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
            <h3 className="text-lg font-semibold tracking-tight">
              {v.replace("[Beta]", "")}
            </h3>
          );
        }}
      />

      {publishedContractResult.data ? (
        <p className="text-sm text-muted-foreground leading-5 mt-1">
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
        <div className="mt-auto pt-3 flex flex-row gap-1 flex-wrap">
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
          "pt-3 relative z-1 flex gap-2 justify-between",
          !modules?.length && "mt-auto",
        )}
      >
        <ContractPublisher
          addressOrEns={publishedContractResult.data?.publisher}
          showSkeleton={showSkeleton}
        />

        <div className="flex justify-between items-center">
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5 py-1.5 px-2.5 text-xs h-auto relative z-10"
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

async function publishedContractQueryFn(
  publisher: string,
  contractId: string,
  version: string,
  queryClient: QueryClient,
) {
  const publisherEns = await queryClient.fetchQuery(ensQuery(publisher));
  // START prefill both publisher ens variations
  if (publisherEns.address) {
    queryClient.setQueryData(
      ensQuery(publisherEns.address).queryKey,
      publisherEns,
    );
  }
  if (publisherEns.ensName) {
    queryClient.setQueryData(
      ensQuery(publisherEns.ensName).queryKey,
      publisherEns,
    );
  }
  // END prefill both publisher ens variations
  invariant(publisherEns.address, "publisher address not found");
  const latestPublishedVersion = await fetchPublishedContractVersion(
    publisherEns.address,
    contractId,
    version,
  );
  invariant(latestPublishedVersion, "no published version found");

  return {
    ...latestPublishedVersion,
    publishedContractId: `${publisher}/${contractId}/${version}`,
  };
}

export function publishedContractQuery(
  publishedContractId: PublishedContractId,
  queryClient: QueryClient,
) {
  const [publisher, contractId, version] = publishedContractId.split("/");
  return {
    queryKey: ["published-contract", { publisher, contractId, version }],
    queryFn: () =>
      publishedContractQueryFn(publisher, contractId, version, queryClient),
    enabled: !!publisher || !!contractId,
  };
}

function usePublishedContract(publishedContractId: PublishedContractId) {
  const queryClient = useQueryClient();
  return useQuery(publishedContractQuery(publishedContractId, queryClient));
}
