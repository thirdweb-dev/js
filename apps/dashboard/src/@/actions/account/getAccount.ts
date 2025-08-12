"use server";

import { getRawAccount } from "@/api/account/get-account";

export async function getRawAccountAction() {
  return getRawAccount();
}
