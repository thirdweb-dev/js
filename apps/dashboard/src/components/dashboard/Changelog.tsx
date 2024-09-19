import { Skeleton } from "@/components/ui/skeleton";
import { formatDistance } from "date-fns/formatDistance";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "tw-components";
import { ClientOnly } from "../ClientOnly/ClientOnly";

export interface ChangelogItem {
  published_at: string;
  title: string;
  url: string;
}

interface ChangelogProps {
  changelog: ChangelogItem[];
}

export const Changelog: React.FC<ChangelogProps> = ({ changelog }) => {
  return (
    <div className="border-l border-border py-2 flex flex-col gap-6 relative">
      {changelog.map((item) => (
        <div className="flex flex-row gap-4" key={item.title}>
          <div className="size-2.5 bg-border rounded-full shrink-0 -translate-x-1/2 translate-y-1/2" />

          <div className="flex flex-col">
            <Link
              isExternal
              href={`${item.url}?utm_source=thirdweb&utm_campaign=changelog`}
              role="group"
              className="line-clamp-2 !text-muted-foreground hover:!text-foreground text-sm hover:!no-underline"
            >
              {item.title}
            </Link>
            <div className="text-muted-foreground opacity-70 text-xs mt-1">
              <ClientOnly ssr={<Skeleton className="h-2" />}>
                {formatDistance(new Date(item.published_at), Date.now(), {
                  addSuffix: true,
                })}
              </ClientOnly>
            </div>
          </div>
        </div>
      ))}
      <Link
        href="https://blog.thirdweb.com/changelog?utm_source=thirdweb&utm_campaign=changelog"
        isExternal
        className="!text-foreground flex items-center gap-2 pl-7 text-sm"
      >
        View More <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
};
