import { ChainCombobox } from "@/components/ChainCombobox";
import { client } from "@/lib/client";
import { resolveName } from "thirdweb/extensions/ens";
import { AutoConnect } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import ConnectButton from "../../../../../components/ConnectButton";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ecosystem: string; address: string };
}) {
  let ens: string | null = null;
  try {
    ens = await resolveName({
      client,
      address: params.address,
    });
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="w-full px-4 py-6 mx-auto border max-w-7xl sm:px-6 lg:px-8">
      <header className="flex flex-col items-center justify-between h-[300px]">
        <div className="flex items-center justify-between w-full">
          <h1>Xai Connect</h1>
          <ConnectButton />
        </div>
        <div className="flex items-end justify-between w-full px-2">
          <h2 className="text-3xl font-bold">
            {ens || shortenAddress(params.address)}
          </h2>
          <ChainCombobox />
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
