import { LinkWalletUI } from "./LinkWalletUI";

export default async function Page() {
  return (
    <div className="grow">
      <LinkWalletUI
        // TODO -  fetch the wallets of current user
        wallets={[]}
      />
    </div>
  );
}
