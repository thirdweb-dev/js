import NftGallery from "@/components/NftGallery";
import { getAddress } from "thirdweb";

export default async function Page({
  params: { address },
  searchParams: { chainId },
}: {
  params: { address: string };
  searchParams: { chainId: string };
}) {
  console.log("wallet page");
  return <NftGallery owner={getAddress(address)} chainId={Number(chainId)} />;
}
