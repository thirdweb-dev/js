import { getRawAccount } from "../../app/(app)/account/settings/getAccount";
import { getAuthTokenWalletAddress } from "../../app/(app)/api/lib/getAuthToken";
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
