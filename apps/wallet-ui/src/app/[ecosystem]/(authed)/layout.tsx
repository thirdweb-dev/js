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
    <div className="flex w-full flex-col items-stretch">
      <header className="hidden w-full border-accent border-b bg-card py-4 sm:block">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center gap-2">
            <img
              className="h-8 w-8"
              src={ecosystem.imageUrl}
              alt={ecosystem.name}
              width={100}
              height={100}
            />
            <h1 className="font-semibold text-xl">{ecosystem.name}</h1>
          </div>
          <ConnectButton ecosystem={`ecosystem.${params.ecosystem}`} />
        </div>
      </header>

      <main className="flex h-full w-full">{children}</main>
    </div>
  );
}
