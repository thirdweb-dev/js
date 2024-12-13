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
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns);

  if (!resolvedInfo) {
    return notFound();
  }

  return (
    <ProfileUI
      ensName={replaceDeployerAddress(resolvedInfo.ensName || "")}
      profileAddress={resolvedInfo.address}
    />
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns);

  if (!resolvedInfo) {
    return notFound();
  }

  const displayName = shortenIfAddress(
    replaceDeployerAddress(resolvedInfo.ensName || resolvedInfo.address),
  );

  return {
    title: displayName,
    description: `Visit ${displayName}'s profile. See their published contracts and deploy them in one click.`,
  };
}
