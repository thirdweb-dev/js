import { getChain } from "app/(dashboard)/(chain)/utils";
import { WalletDashboard } from "./components/WalletDashboard";

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
      <h1 className="mb-2 font-bold text-3xl">Wallet Overview</h1>
      <p className="mb-6 text-muted-foreground text-sm">{params.address}</p>
      <WalletDashboard address={params.address} chain={chain} />
    </main>
  );
}
