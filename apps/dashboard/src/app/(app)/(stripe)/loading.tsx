import { Spinner } from "@/components/ui/Spinner/Spinner";

export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center text-center text-sm">
        <Spinner className="size-8" />
      </div>
    </div>
  );
}
