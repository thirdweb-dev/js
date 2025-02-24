import { getLinkedWallets } from "@/api/linked-wallets";
import { getValidAccount } from "../settings/getAccount";
import { LinkWallet } from "./LinkWalletUI";

export default async function Page() {
  const [wallets, account] = await Promise.all([
    getLinkedWallets(),
    getValidAccount(),
  ]);

  return (
    <div className="flex grow flex-col">
      <header className="border-border border-b py-10">
        <div className="container max-w-[950px]">
          <h1 className="font-semibold text-3xl tracking-tight">
            Linked Wallets
          </h1>
        </div>
      </header>

      <div className="container max-w-[950px] py-8">
        <LinkWallet
          wallets={wallets || []}
          accountEmail={account.email || ""}
        />
      </div>
    </div>
  );
}
