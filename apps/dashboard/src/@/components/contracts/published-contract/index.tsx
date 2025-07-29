"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BookOpenTextIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";
import { PublisherLink } from "@/components//contract-components/publisher/publisher-header";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import type { PublishedContractWithVersion } from "@/components/contract-components/fetch-contracts-with-versions";
import { ContractFunctionsOverview } from "@/components/contracts/functions/contract-functions";
import {
  usePublishedContractEvents,
  usePublishedContractFunctions,
} from "@/hooks/contract-hooks";
import { correctAndUniqueLicenses } from "@/lib/licenses";
import { publicIPFSGateway } from "@/lib/sdk";
import { cn } from "@/lib/utils";

type ExtendedPublishedContract = PublishedContractWithVersion & {
  name: string;
  displayName?: string;
  description?: string;
  version?: string;
  publisher?: string;
  tags?: string[];
  logo?: string;
  audit?: string;
};

export function PublishedContract({
  publishedContract,
  isLoggedIn,
  client,
  maxWidthClassName,
}: {
  publishedContract: ExtendedPublishedContract;
  isLoggedIn: boolean;
  client: ThirdwebClient;
  maxWidthClassName?: string;
}) {
  const contractFunctions = usePublishedContractFunctions(publishedContract);
  const contractEvents = usePublishedContractEvents(publishedContract);

  const publishDate = format(
    new Date(
      Number.parseInt(publishedContract?.publishTimestamp.toString() || "0") *
        1000,
    ),
    "MMM dd, yyyy",
  );

  const licenses = correctAndUniqueLicenses(publishedContract?.licenses || []);

  const sources = useQuery({
    enabled: !!publishedContract.metadata.sources,
    queryFn: async () => {
      invariant(
        publishedContract.metadata.sources,
        "no compilerMetadata sources available",
      );
      return (await fetchSourceFilesFromMetadata(publishedContract, client))
        .map((source) => {
          return {
            ...source,
            filename: source.filename.split("/").pop(),
          };
        })
        .slice()
        .reverse();
    },
    queryKey: ["sources", publishedContract.publishMetadataUri],
  });

  const implementationAddresses =
    publishedContract.factoryDeploymentData?.implementationAddresses;

  const factoryAddresses =
    publishedContract.factoryDeploymentData?.factoryAddresses;

  const hasImplementationAddresses = useMemo(
    () => Object.values(implementationAddresses || {}).some((v) => v !== ""),
    [implementationAddresses],
  );

  const hasFactoryAddresses = useMemo(
    () => Object.values(factoryAddresses || {}).some((v) => v !== ""),
    [factoryAddresses],
  );

  return (
    <div>
      {/* right side content moved below changelog */}
      {publishedContract.publisher && (
        <div className="border-b py-6">
          <div
            className={cn(
              "flex flex-col md:flex-row lg:items-center gap-6 justify-between flex-wrap",
              maxWidthClassName,
            )}
          >
            <PublisherLink
              client={client}
              wallet={publishedContract.publisher}
            />

            <ul className="flex flex-col md:flex-row gap-8 lg:items-center lg:gap-6">
              {/* timestamp */}
              {publishedContract.publishTimestamp && (
                <li className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full border bg-card">
                    <CalendarDaysIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5 [&>*]:leading-none">
                    <h5 className="text-sm font-medium">Publish Date</h5>
                    <p className="text-sm text-muted-foreground">
                      {publishDate}
                    </p>
                  </div>
                </li>
              )}

              {/* audit */}
              {publishedContract?.audit && (
                <li>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-full border bg-card">
                      <ShieldCheckIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1.5 [&>*]:leading-none">
                      <h5 className="text-sm font-medium">Audit Report</h5>
                      <Link
                        href={publicIPFSGateway(publishedContract.audit)}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="flex items-center gap-2 text-sm hover:underline leading-none text-muted-foreground hover:text-foreground"
                      >
                        View Audit Report
                        <ExternalLinkIcon className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </li>
              )}

              {/* license */}
              <li className="flex items-center gap-2.5">
                <div className="p-2 rounded-full border bg-card">
                  <BookOpenTextIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-1.5 [&>*]:leading-none">
                  <h5 className="text-sm font-medium">
                    License{licenses.length > 1 ? "s" : ""}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {licenses.join(", ") || "None"}
                  </p>
                </div>
              </li>

              {(publishedContract?.isDeployableViaProxy &&
                hasImplementationAddresses) ||
              (publishedContract?.isDeployableViaFactory &&
                hasFactoryAddresses) ? (
                <li className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full border bg-card">
                    <ServerIcon className="size-4 text-muted-foreground" />
                  </div>
                  <h5 className="text-sm font-medium">
                    {publishedContract?.isDeployableViaFactory
                      ? "Factory"
                      : "Proxy"}{" "}
                    Enabled
                  </h5>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      )}

      <div className={cn("py-8 space-y-8", maxWidthClassName)}>
        {/* main content */}
        <div className="space-y-6">
          {/* readme */}
          {publishedContract?.readme && (
            <div className="overflow-hidden">
              <MarkdownRenderer markdownText={publishedContract?.readme} />
            </div>
          )}

          {/* changelog */}
          {publishedContract?.changelog && (
            <div className="overflow-hidden">
              <div className="border-b border-dashed pb-3 mb-3">
                <h3 className="text-lg font-semibold">
                  {publishedContract?.version} Release Notes
                </h3>
              </div>
              <MarkdownRenderer
                markdownText={publishedContract?.changelog}
                p={{
                  className: "text-sm leading-6",
                }}
              />
            </div>
          )}

          {contractFunctions && (
            <ContractFunctionsOverview
              abi={publishedContract?.abi}
              events={contractEvents}
              functions={contractFunctions}
              isLoggedIn={isLoggedIn}
              sources={sources.data}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type ContractSource = {
  filename: string;
  source: string;
};

async function fetchSourceFilesFromMetadata(
  publishedMetadata: ExtendedPublishedContract,
  client: ThirdwebClient,
): Promise<ContractSource[]> {
  return await Promise.all(
    Object.entries(publishedMetadata.metadata.sources).map(
      async ([path, info]) => {
        const urls = "urls" in info ? info.urls : undefined;
        const ipfsLink = urls
          ? urls.find((url) => url.includes("ipfs"))
          : undefined;
        if (ipfsLink) {
          const ipfsHash = ipfsLink.split("ipfs/")[1];
          // 3 sec timeout for sources that haven't been uploaded to ipfs
          const timeout = new Promise<string>((_resolve, reject) =>
            setTimeout(() => reject("timeout"), 3000),
          );
          const source = await Promise.race([
            (
              await download({
                client,
                uri: `ipfs://${ipfsHash}`,
              })
            ).text(),
            timeout,
          ]);
          return {
            filename: path,
            source,
          };
        }
        if ("content" in info) {
          return {
            filename: path,
            source: info.content || "Could not find source for this contract",
          };
        }
        return {
          filename: path,
          source: "Could not find source for this contract",
        };
      },
    ),
  );
}
