import { Spinner } from "@/components/ui/Spinner/Spinner";
import { fetchPublishedContracts } from "components/contract-components/fetchPublishedContracts";
import { PublisherSocials } from "components/contract-components/publisher/PublisherSocials";
import { EditProfile } from "components/contract-components/publisher/edit-profile";
import { PublisherAvatar } from "components/contract-components/publisher/masked-avatar";
import { DeployedContracts } from "components/contract-components/tables/deployed-contracts";
import type { ProfileMetadata } from "constants/schemas";
import { Suspense } from "react";
import { shortenIfAddress } from "utils/usedapp-external";
import { getSortedDeployedContracts } from "../../../account/contracts/_components/getSortedDeployedContracts";
import { PublishedContracts } from "./components/published-contracts";

export function ProfileUI(props: {
  profileAddress: string;
  ensName: string | undefined;
  publisherProfile: ProfileMetadata | null;
  showEditProfile: boolean;
}) {
  const { profileAddress, ensName, publisherProfile, showEditProfile } = props;

  const displayName = shortenIfAddress(ensName || profileAddress).replace(
    "deployer.thirdweb.eth",
    "thirdweb.eth",
  );

  return (
    <div className="container pt-8 pb-20">
      {/* Header */}
      <div className="flex w-full flex-col items-center justify-between gap-4 border-border border-b pb-6 md:flex-row">
        <div className="flex w-full items-center gap-4">
          <PublisherAvatar address={profileAddress} className="size-20" />
          <div>
            <h1 className="font-semibold text-4xl tracking-tight">
              {displayName}
            </h1>

            {publisherProfile?.bio && (
              <p className="line-clamp-2 text-muted-foreground">
                {publisherProfile.bio}
              </p>
            )}

            <div className="-translate-x-2 mt-1">
              {publisherProfile && (
                <PublisherSocials publisherProfile={publisherProfile} />
              )}
            </div>
          </div>
        </div>

        {showEditProfile && (
          <div className="shrink-0">
            {publisherProfile && (
              <EditProfile publisherProfile={publisherProfile} />
            )}
          </div>
        )}
      </div>

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
