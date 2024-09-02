import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";

export function DangerSettingCard(props: {
  title: string;
  description: string;
  buttonLabel: string;
  buttonOnClick: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="border border-red-500/70 rounded-lg overflow-hidden">
      <div className="px-4 lg:px-6 py-6 bg-muted/50">
        <h3 className="text-xl font-semibold tracking-tight">{props.title}</h3>

        <p className="text-foreground text-sm mt-1.5 mb-4">
          {props.description}
        </p>
      </div>

      <div className="bg-red-100 dark:bg-red-500/20 px-4 lg:px-6 py-4 flex justify-end border-red-500/70 border-t">
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-600/80 text-white font-semibold gap-2"
          onClick={props.buttonOnClick}
        >
          {props.isLoading && <Spinner className="size-3" />}
          {props.buttonLabel}
        </Button>
      </div>
    </div>
  );
}
