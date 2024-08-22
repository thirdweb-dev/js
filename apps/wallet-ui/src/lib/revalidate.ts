"use server";

import { revalidateTag } from "next/cache";

export async function revalidate(tag: string) {
  revalidateTag(tag);
}
