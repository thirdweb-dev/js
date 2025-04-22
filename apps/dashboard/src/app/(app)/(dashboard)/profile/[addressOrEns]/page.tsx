import { getThirdwebClient } from "@/constants/thirdweb.server";
import { replaceDeployerAddress } from "lib/publisher-utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shortenIfAddress } from "utils/usedapp-external";
import { ProfileUI } from "./ProfileUI";
import { resolveAddressAndEns } from "./resolveAddressAndEns";

type PageProps = {
  params: Promise<{
    addressOrEns: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const client = getThirdwebClient(undefined);
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns, client);

  if (!resolvedInfo) {
    return notFound();
  }

  return (
    <ProfileUI
      ensName={replaceDeployerAddress(resolvedInfo.ensName || "")}
      profileAddress={resolvedInfo.address}
      client={client}
    />
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const client = getThirdwebClient(undefined);
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns, client);

  if (!resolvedInfo) {
    return notFound();
  }

  const displayName = shortenIfAddress(
    replaceDeployerAddress(resolvedInfo.ensName || resolvedInfo.address),
  );

  const title = displayName;
  const description = `Visit ${displayName}'s profile. See their published contracts and deploy them in one click.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}
