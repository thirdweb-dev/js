import { Spinner } from "@/components/ui/Spinner/Spinner";

export function LoadingPage() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center">
      <Spinner className="size-10" />
    </div>
  );
}

export function ErrorPage() {
  return (
    <div className="flex min-h-[300px] grow items-center justify-center">
      <p className="text-destructive-text">Failed to load contract</p>
    </div>
  );
}
