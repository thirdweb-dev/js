import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PublishedContracts } from "../../../(dashboard)/profile/[addressOrEns]/components/published-contracts";
import { resolveAddressAndEns } from "../../../(dashboard)/profile/[addressOrEns]/resolveAddressAndEns";
import { fetchPublishedContracts } from "../../../../components/contract-components/fetchPublishedContracts";

export async function PublishedContractsPage(props: {
  publisherAddress: string;
}) {
  const resolvedInfo = await resolveAddressAndEns(props.publisherAddress);

  return (
    <div className="flex grow flex-col">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="mb-1 font-semibold text-2xl tracking-tight lg:text-3xl">
            Published contracts
          </h2>

          <p className="text-muted-foreground text-sm">
            The list of contracts published to thirdweb across all networks.{" "}
            <Link
              href="https://portal.thirdweb.com/contracts/publish/overview"
              className="text-link-foreground hover:text-foreground"
              target="_blank"
            >
              Learn more about publishing contracts
            </Link>
          </p>
        </div>

        <Button asChild>
          <Link
            href="https://portal.thirdweb.com/contracts/publish/publish-contract"
            target="_blank"
            className="gap-2"
          >
            <PlusIcon className="size-4" />
            Publish Contract
          </Link>
        </Button>
      </div>

      <div className="h-8" />

      <Suspense fallback={<GenericLoadingPage />}>
        <AsyncPublishedContractsTable
          publisherAddress={props.publisherAddress}
          publisherEnsName={resolvedInfo?.ensName}
        />
      </Suspense>
    </div>
  );
}

async function AsyncPublishedContractsTable(props: {
  publisherAddress: string;
  publisherEnsName: string | undefined;
}) {
  const publishedContracts = await fetchPublishedContracts(
    props.publisherAddress,
  );

  if (publishedContracts.length === 0) {
    return (
      <div className="flex min-h-[300px] grow items-center justify-center rounded-lg border border-border">
        No published contracts found
      </div>
    );
  }

  return (
    <PublishedContracts
      publishedContracts={publishedContracts}
      publisherEnsName={props.publisherEnsName}
    />
  );
}
