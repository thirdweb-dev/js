import { AutoConnectWalletConnect } from "@/components/AutoConnectWalletConnect";
import NftGallery from "@/components/NftGallery";
import { getAddress } from "thirdweb";

export default function Page({
  params: { address },
  searchParams: { chainId, uri },
}: {
  params: { address: string };
  searchParams: { chainId?: string; uri?: string };
}) {
  return (
    <>
      <AutoConnectWalletConnect uri={uri} />
      <NftGallery owner={getAddress(address)} chainId={Number(chainId)} />
    </>
  );
}
