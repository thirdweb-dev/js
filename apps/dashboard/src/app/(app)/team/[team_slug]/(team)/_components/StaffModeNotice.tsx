import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StaffModeNotice() {
  return (
    <div className="dark:bg-orange-800 bg-orange-200 border-b px-5">
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-col">
          <p className="font-bold text-lg tracking-tight">Staff Mode</p>
          <p className="text-sm text-foreground/80">
            You can only view this team, not take any actions.
          </p>
        </div>
        <Button
          asChild
          className="rounded-full gap-1.5"
          size="sm"
          variant="default"
        >
          <Link href="/team/~">
            Leave Staff Mode
            <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
