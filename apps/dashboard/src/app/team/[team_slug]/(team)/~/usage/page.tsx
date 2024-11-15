import { redirect } from "next/navigation";
import { getAccount } from "../../../../../account/settings/getAccount";
import { getAccountUsage } from "./getAccountUsage";
import { Usage } from "./overview/components/Usage";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const account = await getAccount();

  if (!account) {
    return redirect(
      `/login?next=${encodeURIComponent(`/team/${params.team_slug}/~/usage`)}`,
    );
  }

  const accountUsage = await getAccountUsage();
  if (!accountUsage) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
        Something went wrong. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex grow flex-col gap-4">
      <h1 className="font-semibold text-3xl tracking-tight">Overview</h1>
      <Usage usage={accountUsage} />
    </div>
  );
}
