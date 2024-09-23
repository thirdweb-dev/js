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
    <div className="relative flex flex-col gap-6 border-border border-l py-2">
      {changelog.map((item) => (
        <div className="flex flex-row gap-4" key={item.title}>
          <div className="-translate-x-1/2 size-2.5 shrink-0 translate-y-1/2 rounded-full bg-border" />

          <div className="flex flex-col">
            <Link
              isExternal
              href={`${item.url}?utm_source=thirdweb&utm_campaign=changelog`}
              role="group"
              className="!text-muted-foreground hover:!text-foreground hover:!no-underline line-clamp-2 text-sm"
            >
              {item.title}
            </Link>
            <div className="mt-1 text-muted-foreground text-xs opacity-70">
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
