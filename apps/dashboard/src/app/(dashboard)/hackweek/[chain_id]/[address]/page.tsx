import { getThirdwebClient } from "@/constants/thirdweb.server";
import { getChain } from "app/(dashboard)/(chain)/utils";
import { resolveAddress as resolveENSAddress } from "thirdweb/extensions/ens";
import { resolveAddress as resolveLensAddress } from "thirdweb/extensions/lens";
import { isAddress } from "thirdweb/utils";
import { WalletDashboard } from "./components/WalletDashboard";
import { WalletProfile } from "./components/WalletProfile";

export default async function Page(props: {
  params: Promise<{
    address: string;
    chain_id: string;
  }>;
}) {
  const params = await props.params;
  const chain = await getChain(params.chain_id);

  // const { address: resolvedAddress, isLoading } = useResolveAddress(
  //   params.address,
  // );

  let resolvedAddress = params.address;
  if (!isAddress(resolvedAddress)) {
    try {
      resolvedAddress = await resolveENSAddress({
        client: getThirdwebClient(),
        name: resolvedAddress,
      });
    } catch {
      try {
        resolvedAddress = await resolveLensAddress({
          client: getThirdwebClient(),
          name: resolvedAddress,
        });
      } catch {}
    }
  }

  return (
    <main className="container mx-auto p-4">
      <WalletProfile address={resolvedAddress} />
      <hr />
      <WalletDashboard address={resolvedAddress} chain={chain} />
    </main>
  );
}
