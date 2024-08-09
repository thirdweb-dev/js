import { Badge } from "@/components/ui/badge";
import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";
import { TrackedLinkTW } from "@/components/ui/tracked-link";
import { cn } from "@/lib/utils";
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ensQuery } from "components/contract-components/hooks";
import { getDashboardChainRpc } from "lib/rpc";
import { getThirdwebSDK, replaceIpfsUrl } from "lib/sdk";
import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { polygon } from "thirdweb/chains";
import invariant from "tiny-invariant";
import { ContractPublisher, replaceDeployerAddress } from "../publisher";

interface ContractCardProps {
  publisher: string;
  contractId: string;
  version?: string;
  tracking?: {
    source: string;
    itemIndex: `${number}`;
  };
  isBeta: boolean | undefined;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  publisher,
  contractId,
  version = "latest",
  tracking,
  isBeta,
}) => {
  const publishedContractResult = usePublishedContract(
    `${publisher}/${contractId}/${version}`,
  );

  const isNewContract = useMemo(() => {
    const newContracts = ["thirdweb.eth/AccountFactory"];
    return newContracts.includes(`${publisher}/${contractId}`);
  }, [publisher, contractId]);

  const showSkeleton = publishedContractResult.isLoading;

  const href = useMemo(() => {
    let h: string;
    if (version !== "latest") {
      h = `/${publisher}/${contractId}/${version}`;
    } else {
      h = `/${publisher}/${contractId}`;
    }

    return replaceDeployerAddress(h);
  }, [contractId, publisher, version]);

  return (
    <article
      className={cn(
        "min-h-[200px] p-4 border border-border relative rounded-lg flex flex-col",
        !showSkeleton ? "bg-secondary hover:bg-muted" : "pointer-events-none",
      )}
    >
      <TrackedLinkTW
        className="absolute inset-0 z-0 cursor-pointer"
        href={href}
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
                href={replaceIpfsUrl(publishedContractResult.data?.audit || "")}
              >
                <ShieldCheckIcon className="size-4" />
                Audited
              </Link>
              <div className="size-1 bg-secondary-foreground/40 rounded-full" />
            </>
          )}

          {/* Version */}
          <SkeletonContainer
            skeletonData={"0.0.0"}
            loadedData={publishedContractResult.data?.version}
            render={(v) => {
              return (
                <p className="text-secondary-foreground text-sm font-medium">
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
        ) : isNewContract ? (
          <Badge variant="outline">New</Badge>
        ) : null}
      </div>

      <div className="h-3.5" />

      <SkeletonContainer
        className="inline-block"
        skeletonData="Edition Drop"
        loadedData={
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
        <p className="text-sm text-secondary-foreground leading-5 mt-1">
          {publishedContractResult.data?.description}
        </p>
      ) : (
        <div className="mt-1">
          <Skeleton className="h-4 w-[80%]" />
          <div className="h-1" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      )}

      <div className="mt-auto pt-3 relative z-1 flex">
        <ContractPublisher
          addressOrEns={publishedContractResult.data?.publisher}
          showSkeleton={showSkeleton}
        />
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
  const polygonSdk = getThirdwebSDK(
    polygon.id,
    getDashboardChainRpc(polygon.id, undefined),
  );

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
  const latestPublishedVersion = await polygonSdk
    .getPublisher()
    .getVersion(publisherEns.address, contractId, version);
  invariant(latestPublishedVersion, "no published version found");
  const contractInfo = await polygonSdk
    .getPublisher()
    .fetchPublishedContractInfo(latestPublishedVersion);
  return {
    ...latestPublishedVersion,
    ...contractInfo.publishedMetadata,

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
