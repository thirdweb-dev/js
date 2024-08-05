import ConnectButton from "@/components/ConnectButton";
import { getEcosystemInfo } from "@/lib/ecosystems";
import Image from "next/image";
import { redirect } from "next/navigation";
import { authedOnly } from "../auth";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string };
}) {
  await authedOnly();
  const ecosystem = await getEcosystemInfo(params.ecosystem).catch(() => {
    redirect("/404"); // TODO: Make ecosystem error page
  });

  return (
    <div className="flex flex-col items-stretch w-full">
      <header className="hidden sm:block w-full py-4 border-b border-accent bg-card">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center gap-2">
            <Image
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
