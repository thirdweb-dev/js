export const Stat: React.FC<{
  label: string;
  value?: number;
  icon: React.FC<{ className?: string }>;
  formatter?: (value: number) => string;
}> = ({ label, value, formatter, icon: Icon }) => {
  return (
    <dl className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 pr-6">
      <div>
        <dd className="mb-0.5 font-semibold text-2xl tracking-tight">
          {value !== undefined && formatter
            ? formatter(value)
            : value?.toLocaleString()}
        </dd>
        <dt className="text-muted-foreground text-sm">{label}</dt>
      </div>
      <Icon className="hidden size-8 text-muted-foreground opacity-50 lg:block" />
    </dl>
  );
};
