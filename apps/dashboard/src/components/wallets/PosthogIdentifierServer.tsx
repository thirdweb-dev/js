import { getRawAccount } from "../../app/account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../app/api/lib/getAuthToken";
import { PosthogIdentifierClient } from "./PosthogIdentifier";

export async function PosthogIdentifierServer() {
  const [account, accountAddress] = await Promise.all([
    getRawAccount(),
    getAuthTokenWalletAddress(),
  ]);

  return (
    <PosthogIdentifierClient
      accountId={account?.id}
      accountAddress={accountAddress || undefined}
    />
  );
}
