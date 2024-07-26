export function PrimaryInfoItem(props: {
  title: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b pb-4 lg:pb-6">
      <div className="flex items-center gap-2">
        <h2 className="text-base text-muted-foreground font-medium">
          {props.title}
        </h2>
        {props.titleIcon}
      </div>
      {props.children}
    </section>
  );
}
