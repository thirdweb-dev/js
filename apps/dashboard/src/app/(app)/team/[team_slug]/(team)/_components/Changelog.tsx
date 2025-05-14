import { formatDistance } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";

type ChangelogItem = {
  published_at: string;
  title: string;
  url: string;
};

export async function Changelog() {
  const changelog = await getChangelog();

  return (
    <div className="relative flex flex-col gap-6 border-border border-l py-2">
      {changelog.map((item) => (
        <div className="flex flex-row gap-2" key={item.title}>
          <div className="-translate-x-1/2 size-2.5 shrink-0 translate-y-1/2 rounded-full bg-border" />

          <div className="flex flex-col">
            <Link
              target="_blank"
              href={`${item.url}?utm_source=thirdweb&utm_campaign=changelog`}
              role="group"
              className="line-clamp-2 text-foreground text-sm hover:underline"
            >
              {item.title}
            </Link>
            <div className="mt-1 text-muted-foreground text-xs">
              {formatDistance(new Date(item.published_at), Date.now(), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      ))}
      <Link
        href="https://blog.thirdweb.com/changelog?utm_source=thirdweb&utm_campaign=changelog"
        target="_blank"
        className="flex items-center gap-2 pl-5 text-foreground text-sm hover:underline"
      >
        View More <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}

const getChangelog = unstable_cache(
  async () => {
    const res = await fetch(
      "https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=title,url,published_at&filter=tag:changelog&visibility:public&limit=10",
    );
    if (!res.ok) {
      return [];
    }
    const json = await res.json();
    return json.posts as ChangelogItem[];
  },
  ["changelog"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);
