import { OctagonAlertIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ErrorState(props: {
  title: string;
  description: string;
  buttons: Array<React.ReactNode>;
}) {
  return (
    <Card className="flex flex-col p-16 gap-8 items-center justify-center">
      <OctagonAlertIcon className="size-8 text-red-500" />
      <div className="flex flex-col gap-1 items-center text-center">
        <h3 className="text-foreground font-medium text-xl">{props.title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {props.description}
        </p>
      </div>
      {props.buttons && (
        <div className="flex gap-4">
          {props.buttons.map((button) => button)}
        </div>
      )}
    </Card>
  );
}
