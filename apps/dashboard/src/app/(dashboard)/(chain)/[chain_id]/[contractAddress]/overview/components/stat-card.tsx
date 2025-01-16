import { SkeletonContainer } from "@/components/ui/skeleton";

export function StatCard(props: {
  value: string;
  isPending: boolean;
  label: string;
}) {
  return (
    <dl className="block rounded-lg border border-border bg-card p-4">
      <dt className="mb-1.5 text-sm md:text-base">{props.label}</dt>
      <SkeletonContainer
        loadedData={props.isPending ? undefined : props.value}
        skeletonData={"0000"}
        render={(v) => <dd className="truncate font-semibold text-xl">{v}</dd>}
      />
    </dl>
  );
}
