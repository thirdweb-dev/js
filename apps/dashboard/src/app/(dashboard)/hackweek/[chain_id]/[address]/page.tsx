import { getChain } from "app/(dashboard)/(chain)/utils";
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

  return (
    <main className="container mx-auto p-4">
      <WalletProfile address={params.address} />
      <hr />
      <WalletDashboard address={params.address} chain={chain} />
    </main>
  );
}
