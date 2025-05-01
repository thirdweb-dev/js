import { SkeletonContainer } from "@/components/ui/skeleton";

export function Stat({
  label,
  value,
  isPending,
}: { label: string; value: string; isPending: boolean }) {
  return (
    <dl className="grow">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <SkeletonContainer
        skeletonData={"000000"}
        loadedData={isPending ? undefined : value}
        render={(v) => <dd className="font-medium text-lg">{v}</dd>}
      />
    </dl>
  );
}

export function StatCard({
  label,
  value,
  isPending,
}: { label: string; value: string; isPending: boolean }) {
  return (
    <dl className="grow rounded-lg border bg-card p-4">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <SkeletonContainer
        skeletonData={"000000"}
        loadedData={isPending ? undefined : value}
        render={(v) => <dd className="font-medium text-lg">{v}</dd>}
      />
    </dl>
  );
}
