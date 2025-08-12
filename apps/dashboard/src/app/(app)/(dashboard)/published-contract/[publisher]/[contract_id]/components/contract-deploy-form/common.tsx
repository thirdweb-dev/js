import { cn } from "@/lib/utils";

export function ContractDeploymentFieldset(props: {
  legend: string;
  description?: React.ReactNode;
  headerChildren?: React.ReactNode;
  children: React.ReactNode;
  headerClassName?: string;
}) {
  return (
    <fieldset className="relative rounded-lg border border-border bg-card">
      <div
        className={cn(
          "border-border border-b p-4 md:px-6 md:py-5",
          props.headerClassName,
        )}
      >
        <legend className="font-semibold text-xl tracking-tight">
          {props.legend}
        </legend>
        {props.description && (
          <p className="mt-1 text-muted-foreground text-sm">
            {props.description}
          </p>
        )}
        {props.headerChildren}
      </div>

      <div className="p-4 md:px-6 md:py-6">{props.children}</div>
    </fieldset>
  );
}
