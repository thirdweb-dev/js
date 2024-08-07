import { cn } from "@/lib/utils";

type CustomToolTipProps = {
  time: string;
  hoverKey: string;
  values: Record<string, number>;
};

const formattingOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const StackToolTip: React.FC<CustomToolTipProps> = ({
  time,
  values,
  hoverKey,
}) => {
  return (
    <div className="flex flex-col p-3 gap-2 border-none outline-none rounded-lg backdrop-blur-lg bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.2)] ">
      <div className="flex flex-col gap-0.5">
        <label className="text-xs font-semibold text-foreground">Date</label>
        <p className="text-xs">
          {new Date(time).toLocaleDateString(undefined, formattingOptions)}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        {Object.entries(values)
          .reverse()
          .map(([key, value]) => (
            <p
              className={cn(
                "text-xs",
                hoverKey && key !== hoverKey ? "opacity-70" : "opacity-100",
              )}
              key={key}
            >
              {hoverKey && key !== hoverKey ? (
                `${key}: `
              ) : (
                <strong>{key}: </strong>
              )}
              {value.toLocaleString()}
            </p>
          ))}
      </div>
    </div>
  );
};
