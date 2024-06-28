"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidate(tag: string) {
  revalidateTag(tag);
}
