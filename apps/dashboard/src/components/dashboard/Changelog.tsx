import { Skeleton } from "@/components/ui/skeleton";
import { Flex } from "@chakra-ui/react";
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
    <Flex
      flexDir="column"
      gap={6}
      position="relative"
      className="border-l border-border py-2"
    >
      {changelog.map((item) => (
        <Flex key={item.title} gap={4}>
          <div className="size-2.5 bg-border rounded-full shrink-0 -translate-x-1/2 translate-y-1/2" />

          <Flex flexDir="column">
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
          </Flex>
        </Flex>
      ))}
      <Link
        href="https://blog.thirdweb.com/changelog?utm_source=thirdweb&utm_campaign=changelog"
        isExternal
        className="!text-foreground flex items-center gap-2 pl-7 text-sm"
      >
        View More <ArrowRightIcon className="size-4" />
      </Link>
    </Flex>
  );
};
