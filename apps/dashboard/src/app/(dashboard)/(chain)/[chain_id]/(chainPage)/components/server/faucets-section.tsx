import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export function FaucetsSection(props: { faucets: readonly string[] }) {
  return (
    <div>
      <h2 className="text-base text-muted-foreground mb-2 font-medium">
        Faucets
      </h2>
      <div className="grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {props.faucets.map((faucet) => {
          const url = new URL(faucet);
          const hostnameSplit = url.hostname.split(".");
          const tld = hostnameSplit.pop();
          const domain = hostnameSplit.pop();
          const displayTitle = `${domain}.${tld}`;
          let displayUrl = url.port + url.hostname + url.pathname;
          displayUrl = displayUrl.endsWith("/")
            ? displayUrl.slice(0, -1)
            : displayUrl;

          return (
            <div
              key={faucet}
              className="p-4 border rounded-xl relative bg-secondary hover:bg-muted"
            >
              <h3 className="mb-1 text-base font-semibold capitalize">
                {displayTitle}
              </h3>
              <Link
                href={faucet}
                target="_blank"
                className="text-sm flex gap-1.5 items-center before:absolute before:inset-0 before:z-0 text-muted-foreground"
              >
                {displayUrl}
              </Link>
              <ExternalLinkIcon className="size-4 absolute top-4 right-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
