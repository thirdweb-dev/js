import { getRawAccount } from "../../account/settings/getAccount";
import { NebulaLoginPage } from "./NebulaLoginPage";

export default async function NebulaLogin() {
  const account = await getRawAccount();

  return <NebulaLoginPage account={account} />;
}
