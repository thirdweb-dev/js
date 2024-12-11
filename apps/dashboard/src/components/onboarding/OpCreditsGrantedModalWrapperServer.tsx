import { getRawAccount } from "../../app/account/settings/getAccount";
import { OpCreditsGrantedModalWrapper } from "./OpCreditsGrantedModalWrapper";

export async function OpCreditsGrantedModalWrapperServer() {
  const account = await getRawAccount();
  if (!account) {
    return null;
  }

  return <OpCreditsGrantedModalWrapper twAccount={account} />;
}
