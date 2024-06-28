import ConnectButton from "@/components/ConnectButton";
import { getEcosystemInfo } from "@/lib/ecosystems";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string };
}) {
  const ecosystem = await getEcosystemInfo(
    `ecosystem.${params.ecosystem}`,
  ).catch((e) => {
    console.log("error here", e);
    redirect("/404"); // TODO: Make ecosystem error page
  });

  return (
    <div className="flex flex-col items-stretch w-full">
      <header className="w-full p-4 px-8 border-b border-accent bg-card">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
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
          <ConnectButton />
        </div>
      </header>

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
}
