"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidatePathAction(
  path: string,
  type: "page" | "layout",
) {
  revalidatePath(path, type);
}

export async function revalidateCacheTagAction(tag: string) {
  revalidateTag(tag);
}
