"use server";

import { getRawAccount } from "../../app/(app)/account/settings/getAccount";

export async function getRawAccountAction() {
  return getRawAccount();
}
