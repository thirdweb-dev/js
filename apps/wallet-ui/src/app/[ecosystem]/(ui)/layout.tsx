import ConnectButton from "@/components/ConnectButton";
import { authedOnly } from "@/lib/auth";
import { getEcosystemInfo } from "@/lib/ecosystems";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string };
}) {
  await authedOnly();
  const ecosystem = await getEcosystemInfo(params.ecosystem);
  return (
    <div className="flex flex-col items-stretch w-full">
      <header className="hidden sm:block w-full py-4 border-b border-accent bg-card">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8"
              src={ecosystem.imageUrl}
              alt={ecosystem.name}
              width={100}
              height={100}
            />
            <h1 className="text-xl font-semibold">{ecosystem.name}</h1>
          </div>
          <ConnectButton ecosystem={`ecosystem.${params.ecosystem}`} />
        </div>
      </header>

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
}
