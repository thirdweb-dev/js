import { formatDistance } from "date-fns";
import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Img } from "@/components/blocks/Img";
import { Button } from "@/components/ui/button";

type ChangelogItem = {
  published_at: string;
  title: string;
  url: string;
  feature_image: string;
};

export async function Changelog() {
  const changelog = await getChangelog();

  return (
    <div className="relative flex grow flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="mb-1 font-semibold text-2xl tracking-tight">
            Changelog
          </h2>
          <p className="text-muted-foreground text-sm">
            View the latest updates to thirdweb products and services
          </p>
        </div>

        <Button
          asChild
          className="gap-2 rounded-full bg-card"
          variant="outline"
        >
          <Link
            href="https://blog.thirdweb.com/changelog?utm_source=thirdweb&utm_campaign=changelog"
            rel="noopener noreferrer"
            target="_blank"
          >
            View All <ArrowRightIcon className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {changelog.map((item) => (
          <div
            className="relative overflow-hidden rounded-xl border bg-card hover:border-active-border"
            key={item.title}
          >
            <Img
              alt={item.title}
              className="aspect-video w-full object-cover"
              fallback={
                <div className="flex items-center justify-center bg-gradient-to-b from-card to-accent">
                  <div className="rounded-full border p-3">
                    <FileTextIcon className="size-5 text-muted-foreground" />
                  </div>
                </div>
              }
              src={item.feature_image}
            />

            <div className="border-t px-3 py-4">
              <Link
                className="mb-2 line-clamp-2 font-medium text-base text-foreground before:absolute before:inset-0"
                href={`${item.url}?utm_source=thirdweb&utm_campaign=changelog`}
                target="_blank"
              >
                {item.title}
              </Link>

              <div className="text-muted-foreground text-sm">
                {formatDistance(new Date(item.published_at), Date.now(), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getChangelog = unstable_cache(
  async () => {
    const res = await fetch(
      "https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=title,url,published_at,feature_image&filter=tag:changelog&visibility:public&limit=12",
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
