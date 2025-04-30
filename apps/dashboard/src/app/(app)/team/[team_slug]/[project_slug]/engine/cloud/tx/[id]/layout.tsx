import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TransactionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { team_slug: string; project_slug: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link
          href={`/team/${params.team_slug}/${params.project_slug}/engine/cloud`}
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Transactions
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
