import { Card } from "@/components/ui/card";

export function EmptyState(props: {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  buttons: Array<React.ReactNode>;
}) {
  return (
    <Card className="flex flex-col p-16 gap-8 items-center justify-center">
      <div className="bg-violet-800/25 text-muted-foreground rounded-full size-16 flex items-center justify-center">
        <props.icon className="size-8 text-violet-500" />
      </div>
      <div className="flex flex-col gap-1 items-center text-center">
        <h3 className="text-foreground font-medium text-xl">{props.title}</h3>
        <p className="text-muted-foreground text-sm max-w-md">
          {props.description}
        </p>
      </div>
      <div className="flex gap-4">{props.buttons.map((button) => button)}</div>
    </Card>
  );
}
