"use server";

import { getRawAccount } from "../../app/account/settings/getAccount";

export async function getRawAccountAction() {
  return getRawAccount();
}
