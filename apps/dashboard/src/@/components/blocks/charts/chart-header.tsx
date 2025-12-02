import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkeletonContainer } from "@/components/ui/skeleton";

export function TotalValueChartHeader(props: {
  total: number;
  title: string;
  isPending: boolean;
  viewMoreLink: string | undefined;
}) {
  return (
    <div className="space-y-1 p-6 pb-0 flex justify-between items-start gap-3">
      <div>
        <SkeletonContainer
          loadedData={!props.isPending ? props.total : undefined}
          skeletonData={100}
          render={(value) => {
            return (
              <p className="text-3xl font-semibold tracking-tight">
                {compactNumberFormatter.format(value)}
              </p>
            );
          }}
        />

        <h3 className="text-muted-foreground">{props.title}</h3>
      </div>

      {props.viewMoreLink && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="gap-2 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Link href={props.viewMoreLink}>
            <span>View More</span>
            <ArrowUpRightIcon className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});
