import { Spinner } from "@/components/ui/Spinner/Spinner";
import { fetchPublishedContracts } from "components/contract-components/fetchPublishedContracts";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import { ProfileHeader } from "./components/profile-header";
import { PublishedContracts } from "./components/published-contracts";

export function ProfileUI(props: {
  profileAddress: string;
  ensName: string | undefined;
  client: ThirdwebClient;
}) {
  const { profileAddress, ensName, client } = props;

  return (
    <div className="container pt-8 pb-20">
      <ProfileHeader profileAddress={profileAddress} ensName={ensName} />
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
            client={client}
          />
        </Suspense>
      </div>

      <div className="h-12" />
    </div>
  );
}

async function AsyncPublishedContracts(props: {
  publisherAddress: string;
  publisherEnsName: string | undefined;
  client: ThirdwebClient;
}) {
  const publishedContracts = await fetchPublishedContracts({
    address: props.publisherAddress,
    client: props.client,
  });

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
      client={props.client}
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
