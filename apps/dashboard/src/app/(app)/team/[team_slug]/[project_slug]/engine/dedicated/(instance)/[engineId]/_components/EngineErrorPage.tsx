import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import Link from "next/link";

export function EngineErrorPage(props: {
  children: React.ReactNode;
  rootPath: string;
}) {
  return (
    <div className="flex grow flex-col">
      <Link
        href={props.rootPath}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-5" />
        Back
      </Link>

      <div className="mt-5 flex min-h-[300px] grow flex-col items-center justify-center rounded-lg border border-border px-4 lg:min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <CircleAlertIcon className="size-16 text-destructive-text" />
          <div className="text-center text-muted-foreground">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
