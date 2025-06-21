import { DeployableContractTable } from "components/contract-components/contract-table";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";

export default async function DeployMultipleContractsPage(props: {
  searchParams?: Promise<{
    ipfs?: string[] | string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const ipfsHashes = searchParams?.ipfs;

  if (!ipfsHashes || !Array.isArray(ipfsHashes) || ipfsHashes.length === 0) {
    notFound();
  }

  return (
    <div className="container flex grow flex-col py-10">
      <h1 className="mb-1 font-semibold text-2xl tracking-tight">
        Deploy Contracts
      </h1>
      <p className="text-muted-foreground">
        Welcome to the thirdweb contract deployment flow.{" "}
        <Link
          className="text-link-foreground hover:text-foreground"
          href="https://portal.thirdweb.com/contracts/deploy/overview"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more about deploying your contracts.
        </Link>
      </p>

      <div className="h-6" />

      <Suspense fallback={<GenericLoadingPage />}>
        <DeployableContractTable context="deploy" contractIds={ipfsHashes} />
      </Suspense>
    </div>
  );
}
