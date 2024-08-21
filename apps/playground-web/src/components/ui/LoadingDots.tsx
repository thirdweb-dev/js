export function LoadingDots() {
  return (
    <div className="flex gap-2 fade-in-0 duration-300 animate-in">
      <span className="sr-only">Loading...</span>
      <div className="size-4 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="size-4 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="size-4 bg-foreground rounded-full animate-bounce" />
    </div>
  );
}
