import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { DeployableContractTable } from "components/contract-components/contract-table";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUserThirdwebClient } from "../../../api/lib/getAuthToken";

export default async function DeployMultipleContractsPage(props: {
  searchParams?: Promise<{
    ipfs?: string[] | string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const ipfsHashes = searchParams?.ipfs;
  const client = await getUserThirdwebClient();

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
          target="_blank"
          href="https://portal.thirdweb.com/contracts/deploy/overview"
        >
          Learn more about deploying your contracts.
        </Link>
      </p>

      <div className="h-6" />

      <Suspense fallback={<GenericLoadingPage />}>
        <DeployableContractTable
          contractIds={ipfsHashes}
          context="deploy"
          client={client}
        />
      </Suspense>
    </div>
  );
}
