"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BookOpenTextIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  PencilIcon,
  ServerIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { download } from "thirdweb/storage";
import invariant from "tiny-invariant";
import { PublisherHeader } from "@/components//contract-components/publisher/publisher-header";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import type { PublishedContractWithVersion } from "@/components/contract-components/fetch-contracts-with-versions";
import { ContractFunctionsOverview } from "@/components/contracts/functions/contract-functions";
import { Button } from "@/components/ui/button";
import {
  usePublishedContractEvents,
  usePublishedContractFunctions,
} from "@/hooks/contract-hooks";
import { correctAndUniqueLicenses } from "@/lib/licenses";
import { replaceIpfsUrl } from "@/lib/sdk";
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
  className,
}: {
  publishedContract: ExtendedPublishedContract;
  isLoggedIn: boolean;
  client: ThirdwebClient;
  className?: string;
}) {
  const address = useActiveAccount()?.address;

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
    <div
      className={cn(
        "py-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8",
        className,
      )}
    >
      {/* left */}
      <div className="space-y-6">
        {address === publishedContract.publisher && (
          <div className="flex justify-end">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="ml-auto gap-2"
            >
              <Link
                href={`/contracts/publish/${encodeURIComponent(
                  publishedContract.publishMetadataUri.replace("ipfs://", ""),
                )}`}
              >
                <PencilIcon className="size-3" />
                Edit
              </Link>
            </Button>
          </div>
        )}

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

      {/* right */}
      <div className="space-y-6">
        {publishedContract.publisher && (
          <PublisherHeader
            client={client}
            wallet={publishedContract.publisher}
          />
        )}

        <div className="border-t border-dashed" />

        <ul className="space-y-6">
          {/* timestamp */}
          {publishedContract.publishTimestamp && (
            <li className="flex items-center gap-3">
              <div className="p-2 rounded-full border bg-card">
                <CalendarDaysIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium leading-none">
                  Publish Date
                </h5>
                <p className="text-sm leading-none text-muted-foreground">
                  {publishDate}
                </p>
              </div>
            </li>
          )}

          {/* audit */}
          {publishedContract?.audit && (
            <li>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full border bg-card">
                  <ShieldCheckIcon className="size-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium leading-none">
                    Audit Report
                  </h5>
                  <Link
                    href={replaceIpfsUrl(publishedContract.audit, client)}
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
          <li className="flex items-center gap-3">
            <div className="p-2 rounded-full border bg-card">
              <BookOpenTextIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h5 className="text-sm font-medium leading-none">
                License{licenses.length > 1 ? "s" : ""}
              </h5>
              <p className="text-sm leading-none text-muted-foreground">
                {licenses.join(", ") || "None"}
              </p>
            </div>
          </li>

          {(publishedContract?.isDeployableViaProxy &&
            hasImplementationAddresses) ||
          (publishedContract?.isDeployableViaFactory && hasFactoryAddresses) ? (
            <li className="flex items-center gap-3">
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

        <div className="border-t border-dashed" />

        <Button
          asChild
          className="w-full gap-2 bg-card rounded-full"
          variant="outline"
        >
          <Link
            href="https://portal.thirdweb.com/tokens/publish/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn more about Publish{" "}
            <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
          </Link>
        </Button>
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
