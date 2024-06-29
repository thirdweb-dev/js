import NftGallery, { NftGalleryLoading } from "@/components/NftGallery";
import { Suspense } from "react";
import { isAddress } from "thirdweb";

export default async function Page({
  params: { address },
  searchParams: { chainId },
}: {
  params: { address: string };
  searchParams: { chainId: string };
}) {
  if (!isAddress(address)) {
    return <div>Invalid address</div>; // todo: reroute to 404 invalid address page
  }

  return (
    <Suspense fallback={<NftGalleryLoading />}>
      <NftGallery owner={address} chainId={Number(chainId)} />
    </Suspense>
  );
}
