export const Stat: React.FC<{
  label: string;
  value?: number;
  icon: React.FC<{ className?: string }>;
  formatter?: (value: number) => string;
}> = ({ label, value, formatter, icon: Icon }) => {
  return (
    <dl className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 lg:p-6">
      <div>
        <dd className="font-semibold text-3xl tracking-tight lg:text-5xl">
          {value !== undefined && formatter
            ? formatter(value)
            : value?.toLocaleString()}
        </dd>
        <dt className="font-medium text-muted-foreground text-sm tracking-tight lg:text-lg">
          {label}
        </dt>
      </div>
      <Icon className="hidden size-12 text-muted-foreground opacity-50 lg:block" />
    </dl>
  );
};
