import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/redirect";

export default async function Page({
  params,
}: { params: Promise<{ ecosystem: string }> }) {
  const { ecosystem } = await params;
  const user = await getCurrentUser();
  if (user) {
    redirect(`/wallet/${user}`, ecosystem);
  }
  redirect("/login", ecosystem);
}
