// This page is to accept a Wallet Connect request
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "@/lib/redirect";

export default async function Page(props: {
  params: Promise<{ ecosystem: string }>;
  searchParams: Promise<{ uri: string }>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const { uri } = searchParams;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?uri=${encodeURIComponent(uri)}`, params.ecosystem);
  }

  redirect(
    `/wallet/${currentUser}?uri=${encodeURIComponent(uri)}`,
    params.ecosystem,
  );
}
