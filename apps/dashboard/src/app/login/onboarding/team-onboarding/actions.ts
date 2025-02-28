"use server";

import { revalidatePath } from "next/cache";

export async function revalidateTeamLayout(teamSlug: string) {
  revalidatePath(`/team/${teamSlug}`, "layout");
}
