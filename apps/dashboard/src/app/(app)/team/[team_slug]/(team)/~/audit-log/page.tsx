import { redirect } from "next/navigation";
import { getAuditLogs } from "@/api/audit-log";
import { getTeamBySlug } from "@/api/team";
import { getValidAccount } from "../../../../../account/settings/getAccount";
import { AuditLogList } from "./_components/list";
import { searchParamLoader } from "./search-params";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    searchParamLoader(props.searchParams),
  ]);
  const [, team] = await Promise.all([
    getValidAccount(`/team/${params.team_slug}/~/audit-log`),
    getTeamBySlug(params.team_slug),
  ]);

  if (!team) {
    redirect("/team");
  }

  const auditLogs = await getAuditLogs(
    team.slug,
    searchParams.after ?? undefined,
  );

  if (auditLogs.status === "error") {
    switch (auditLogs.reason) {
      case "higher_plan_required":
        return (
          <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
            You need to upgrade to a paid plan to view audit logs.
          </div>
        );
      default:
        return (
          <div className="flex min-h-[350px] items-center justify-center rounded-lg border p-4 text-destructive-text">
            Something went wrong. Please try again later.
          </div>
        );
    }
  }

  return (
    <div className="container flex flex-col gap-8">
      {auditLogs.data.result.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p className="text-sm">No audit events found</p>
        </div>
      ) : (
        <AuditLogList
          entries={auditLogs.data.result}
          hasMore={auditLogs.data.hasMore}
          nextCursor={auditLogs.data.nextCursor}
        />
      )}
    </div>
  );
}
