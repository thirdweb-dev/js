// This page is to accept a Wallet Connect request
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page(props: {
  searchParams: Promise<{ uri: string }>;
}) {
  const searchParams = await props.searchParams;

  const { uri } = searchParams;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?uri=${encodeURIComponent(uri)}`);
  }

  redirect(`/wallet/${currentUser}?uri=${encodeURIComponent(uri)}`);
}
