import { getValidAccount } from "@/api/account/get-account";
import { Notifications } from "./Notifications";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getValidAccount(
    `/team/${params.team_slug}/~/settings/notifications`,
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-semibold text-2xl tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          Configure your email notification preferences
        </p>
      </div>

      <Notifications account={account} />
    </div>
  );
}
