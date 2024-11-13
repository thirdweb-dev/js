import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: { params: Promise<{ ecosystem: string }> }) {
  const { ecosystem } = await params;
  const address = await getCurrentUser();
  if (address) {
    redirect(`${ecosystem}/wallet/${address}`);
  }
  redirect(`${ecosystem}/login`);
}
