export function NoDataOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-card/50 text-muted-foreground text-sm backdrop-blur-sm">
      No data available
    </div>
  );
}

export function CardHeading(props: { children: React.ReactNode }) {
  return <h3 className="font-medium text-base">{props.children}</h3>;
}

export function TableData({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 text-sm">{children}</td>;
}

export function TableHeadingRow({ children }: { children: React.ReactNode }) {
  return <tr className="sticky top-0 z-10 bg-background">{children}</tr>;
}

export function TableHeading(props: { children: React.ReactNode }) {
  return (
    <th className="min-w-[150px] border-border border-b bg-background px-3 py-3 text-left font-medium text-muted-foreground text-sm">
      {props.children}
    </th>
  );
}

export const chartHeight = 220;
