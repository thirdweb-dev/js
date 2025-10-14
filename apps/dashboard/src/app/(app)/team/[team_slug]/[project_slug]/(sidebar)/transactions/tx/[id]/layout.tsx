import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default function TransactionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { team_slug: string; project_slug: string };
}) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Link
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
          href={`/team/${params.team_slug}/${params.project_slug}/transactions`}
        >
          <ChevronLeftIcon className="size-4" />
          Back to Transactions
        </Link>
      </div>
      <div className="flex-1 space-y-6">{children}</div>
    </div>
  );
}
