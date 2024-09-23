export function LoadingDots() {
  return (
    <div className="fade-in-0 flex animate-in gap-2 duration-300">
      <span className="sr-only">Loading...</span>
      <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.3s]" />
      <div className="size-4 animate-bounce rounded-full bg-foreground [animation-delay:-0.15s]" />
      <div className="size-4 animate-bounce rounded-full bg-foreground" />
    </div>
  );
}
