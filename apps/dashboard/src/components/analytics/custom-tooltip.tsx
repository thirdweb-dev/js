type CustomToolTipProps = {
  valueLabel: string;
  active?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  payload?: any;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  valueFormatter?: (value: any) => string;
};

const formattingOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const CustomToolTip: React.FC<CustomToolTipProps> = ({
  active,
  payload,
  valueLabel,
  valueFormatter,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col p-3 gap-2 border-none outline-none rounded-lg backdrop-blur-lg bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(0,0,0,0.2)] ">
        {payload[0]?.payload?.time && (
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-semibold text-foreground">
              Date
            </label>
            <p className="text-xs">
              {new Date(payload[0].payload.time).toLocaleDateString(
                undefined,
                formattingOptions,
              )}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-semibold text-foreground">
            {valueLabel}
          </label>
          <p className="text-xs font-mono">
            {valueFormatter
              ? valueFormatter(payload[0].value)
              : payload[0].value.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
