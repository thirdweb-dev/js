import { XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState(props: {
  title: string;
  description: string;
  buttons: Array<React.ReactNode>;
}) {
  return (
    <Card className="flex flex-col p-16 gap-5 items-center justify-center">
      <div className="rounded-full p-2.5 border bg-background">
        <XIcon className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <h3 className="text-foreground font-medium text-lg tracking-tight">
          {props.title}
        </h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {props.description}
        </p>
      </div>
      <div className="flex gap-4">{props.buttons.map((button) => button)}</div>
    </Card>
  );
}
