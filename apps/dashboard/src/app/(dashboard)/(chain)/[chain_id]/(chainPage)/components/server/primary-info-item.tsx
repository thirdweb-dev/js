export function PrimaryInfoItem(props: {
  title: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-base text-muted-foreground">
          {props.title}
        </h3>
        {props.titleIcon}
      </div>
      {props.children}
    </div>
  );
}
