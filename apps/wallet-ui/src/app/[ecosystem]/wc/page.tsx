// This page is to accept a Wallet Connect request
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams: Promise<{ uri: string }>;
  params: Promise<{ ecosystem: string }>;
}) {
  const [{ uri }, { ecosystem }] = await Promise.all([
    props.searchParams,
    props.params,
  ]);

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`${ecosystem}/login?uri=${encodeURIComponent(uri)}`);
  }

  redirect(`${ecosystem}/wallet/${currentUser}?uri=${encodeURIComponent(uri)}`);
}
