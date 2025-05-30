import { getLinkedWallets } from "@/api/linked-wallets";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getAuthToken } from "../../api/lib/getAuthToken";
import { loginRedirect } from "../../login/loginRedirect";
import { getValidAccount } from "../settings/getAccount";
import { LinkWallet } from "./LinkWalletUI";

export default async function Page() {
  const [wallets, account, authToken] = await Promise.all([
    getLinkedWallets(),
    getValidAccount("/account/wallets"),
    getAuthToken(),
  ]);

  if (!authToken) {
    loginRedirect("/account/wallets");
  }

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: undefined,
  });

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
          client={client}
        />
      </div>
    </div>
  );
}
