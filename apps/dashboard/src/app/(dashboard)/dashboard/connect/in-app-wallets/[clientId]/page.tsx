import { redirect } from "next/navigation";

export default async function Page(props: {
  params: {
    clientId: string;
  };
  searchParams: {
    tab?: string;
  };
}) {
  const { clientId } = props.params;

  redirect(`/dashboard/connect/in-app-wallets/${clientId}/analytics`);
}
