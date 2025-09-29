import { getAddress } from "thirdweb";
import { AutoConnectWalletConnect } from "@/components/AutoConnectWalletConnect";
import NftGallery from "@/components/NftGallery";
import { getEcosystemChainIds } from "@/lib/ecosystemConfig";

export default async function Page(props: {
  params: Promise<{ ecosystem: string; address: string }>;
  searchParams: Promise<{ chainId?: string; uri?: string }>;
}) {
  const [searchParams, params] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const { chainId, uri } = searchParams;
  const { address, ecosystem } = params;
  const allowedChainIds = getEcosystemChainIds(ecosystem);
  const parsedChainId = chainId ? Number(chainId) : undefined;

  return (
    <>
      <AutoConnectWalletConnect uri={uri} />
      <NftGallery
        allowedChainIds={allowedChainIds}
        chainId={parsedChainId}
        owner={getAddress(address)}
      />
    </>
  );
}
