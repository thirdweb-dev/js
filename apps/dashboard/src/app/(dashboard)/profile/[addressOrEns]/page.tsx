import { getActiveAccountCookie } from "@/constants/cookie";
import { fetchPublisherProfile } from "components/contract-components/fetch-contracts-with-versions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAddress } from "thirdweb/utils";
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
  const currentUserAddress = await getCurrentUserAddress();

  if (!resolvedInfo) {
    return notFound();
  }

  const publisherProfile = await fetchPublisherProfile(
    resolvedInfo.address,
  ).catch(() => null);

  return (
    <ProfileUI
      ensName={resolvedInfo.ensName}
      profileAddress={resolvedInfo.address}
      publisherProfile={publisherProfile}
      showEditProfile={currentUserAddress === resolvedInfo.address}
    />
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const resolvedInfo = await resolveAddressAndEns(params.addressOrEns);

  if (!resolvedInfo) {
    return notFound();
  }

  const publisherProfile = await fetchPublisherProfile(
    resolvedInfo.address,
  ).catch(() => null);

  if (!publisherProfile) {
    return notFound();
  }

  const displayName = shortenIfAddress(
    resolvedInfo.ensName || resolvedInfo.address,
  ).replace("deployer.thirdweb.eth", "thirdweb.eth");

  // TODO - move this to opengraph-image.tsx
  // this is not working even on prod
  // const ogImageLink = ProfileOG.toUrl({
  //   displayName,
  //   bio: publisherProfile.bio,
  //   avatar: publisherProfile.avatar,
  // });

  return {
    title: displayName,
    description: `Visit ${displayName}'s profile. See their published contracts and deploy them in one click.`,
    // openGraph: {
    //   title: displayName,
    //   images: ogImageLink
    //     ? [
    //         {
    //           url: ogImageLink.toString(),
    //           alt: `${displayName}'s profile on thirdweb.com`,
    //           width: 1200,
    //           height: 630,
    //         },
    //       ]
    //     : undefined,
    // },
  };
}

async function getCurrentUserAddress() {
  try {
    const currentUserAddress = await getActiveAccountCookie();
    if (!currentUserAddress) {
      return null;
    }
    return getAddress(currentUserAddress);
  } catch {
    return null;
  }
}
