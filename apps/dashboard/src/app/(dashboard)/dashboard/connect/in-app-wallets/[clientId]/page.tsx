import { redirect } from "next/navigation";

export default async function Page(props: {
  params: Promise<{
    clientId: string;
  }>;
}) {
  const { clientId } = await props.params;

  redirect(`/dashboard/connect/in-app-wallets/${clientId}/analytics`);
}
