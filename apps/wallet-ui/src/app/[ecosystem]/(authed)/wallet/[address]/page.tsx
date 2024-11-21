import { AutoConnectWalletConnect } from "@/components/AutoConnectWalletConnect";
import NftGallery from "@/components/NftGallery";
import { getAddress } from "thirdweb";

export default async function Page(props: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ chainId?: string; uri?: string }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const { chainId, uri } = searchParams;
  const { address } = params;

  return (
    <>
      <AutoConnectWalletConnect uri={uri} />
      <NftGallery owner={getAddress(address)} chainId={Number(chainId)} />
    </>
  );
}
