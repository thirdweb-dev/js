import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadataWithServices } from "../../../../types/chain";

export function ExplorersSection(props: {
  explorers: NonNullable<ChainMetadataWithServices["explorers"]>;
}) {
  return (
    <div>
      <h2 className="text-base text-muted-foreground mb-2 font-medium">
        Explorers
      </h2>
      <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {props.explorers.map((explorer) => {
          return (
            <div
              key={explorer.url}
              className="p-4 border rounded-xl relative bg-secondary hover:bg-muted"
            >
              <h3 className="mb-1 text-base font-semibold capitalize">
                {explorer.name}
              </h3>
              <Link
                href={explorer.url}
                target="_blank"
                className="text-sm flex gap-1.5 items-center before:absolute before:inset-0 before:z-0 text-muted-foreground"
              >
                {explorer.url.endsWith("/")
                  ? explorer.url.slice(0, -1)
                  : explorer.url}
              </Link>
              <ExternalLinkIcon className="size-4 absolute top-4 right-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
