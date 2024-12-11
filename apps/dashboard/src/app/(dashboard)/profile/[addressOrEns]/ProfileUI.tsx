import { Spinner } from "@/components/ui/Spinner/Spinner";
import { fetchPublishedContracts } from "components/contract-components/fetchPublishedContracts";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import { Suspense } from "react";
import { getSortedDeployedContracts } from "../../../account/contracts/_components/getSortedDeployedContracts";
import { ProfileHeader } from "./components/profile-header";
import { PublishedContracts } from "./components/published-contracts";

export function ProfileUI(props: {
  profileAddress: string;
  ensName: string | undefined;
}) {
  const { profileAddress, ensName } = props;

  return (
    <div className="container pt-8 pb-20">
      <ProfileHeader profileAddress={profileAddress} />
      <div className="h-8" />

      <div>
        <h2 className="font-semibold text-2xl tracking-tight">
          Published contracts
        </h2>

        <div className="h-4" />
        <Suspense fallback={<LoadingSection />}>
          <AsyncPublishedContracts
            publisherAddress={profileAddress}
            publisherEnsName={ensName}
          />
        </Suspense>
      </div>

      <div className="h-12" />

      <div>
        <h2 className="font-semibold text-2xl tracking-tight">
          Deployed contracts
        </h2>

        <p className="text-muted-foreground">
          List of contracts deployed across all Mainnets
        </p>

        <div className="h-4" />
        <Suspense fallback={<LoadingSection />}>
          <AsyncDeployedContracts profileAddress={profileAddress} />
        </Suspense>
      </div>
    </div>
  );
}

async function AsyncDeployedContracts(props: {
  profileAddress: string;
}) {
  const contracts = await getSortedDeployedContracts({
    address: props.profileAddress,
    onlyMainnet: true,
  });

  return <DeployedContracts contractList={contracts} limit={50} />;
}

async function AsyncPublishedContracts(props: {
  publisherAddress: string;
  publisherEnsName: string | undefined;
}) {
  const publishedContracts = await fetchPublishedContracts(
    props.publisherAddress,
  );

  if (publishedContracts.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-border">
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

function LoadingSection() {
  return (
    <div className="flex min-h-[450px] items-center justify-center rounded-lg border border-border">
      <Spinner className="size-10" />
    </div>
  );
}
