import { Spinner } from "@/components/ui/Spinner/Spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Spinner className="size-10" />
    </div>
  );
}
