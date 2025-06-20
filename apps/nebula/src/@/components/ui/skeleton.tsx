import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-skeleton rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function SkeletonContainer<T>(props: {
  loadedData?: T;
  skeletonData: T;
  className?: string;
  render: (data: T) => React.ReactNode;
  style?: React.CSSProperties;
}) {
  const isLoading = props.loadedData === undefined;
  return (
    <div
      aria-hidden={isLoading ? "true" : "false"}
      className={cn(
        isLoading && "inline-block animate-pulse rounded-lg bg-muted",
        props.className,
      )}
      style={props.style}
    >
      <div className={cn(isLoading && "invisible")}>
        <div
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
          )}
        >
          {props.render(
            props.loadedData === undefined
              ? props.skeletonData
              : props.loadedData,
          )}
        </div>
      </div>
    </div>
  );
}

export { Skeleton, SkeletonContainer };
