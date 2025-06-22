import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { serverThirdwebClient } from "@/constants/thirdweb-client.server";
import { replaceDeployerAddress } from "@/lib/publisher-utils";
import { shortenIfAddress } from "@/utils/usedapp-external";
import { ProfileUI } from "./ProfileUI";
import { resolveAddressAndEns } from "./resolveAddressAndEns";

type PageProps = {
  params: Promise<{
    addressOrEns: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const resolvedInfo = await resolveAddressAndEns(
    params.addressOrEns,
    serverThirdwebClient,
  );

  if (!resolvedInfo) {
    return notFound();
  }

  return (
    <ProfileUI
      client={getClientThirdwebClient()}
      ensName={replaceDeployerAddress(resolvedInfo.ensName || "")}
      profileAddress={resolvedInfo.address}
    />
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const resolvedInfo = await resolveAddressAndEns(
    params.addressOrEns,
    serverThirdwebClient,
  );

  if (!resolvedInfo) {
    return notFound();
  }

  const displayName = shortenIfAddress(
    replaceDeployerAddress(resolvedInfo.ensName || resolvedInfo.address),
  );

  const title = displayName;
  const description = `Visit ${displayName}'s profile. See their published contracts and deploy them in one click.`;

  return {
    description,
    openGraph: {
      description,
      title,
    },
    title,
  };
}
