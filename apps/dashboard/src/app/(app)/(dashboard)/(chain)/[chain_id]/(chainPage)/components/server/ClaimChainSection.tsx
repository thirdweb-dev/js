import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

export function ClaimChainSection() {
  return (
    <section>
      <SectionTitle title="Claim Chain" />
      <div className="rounded-lg border bg-card p-4">
        <p className="mb-1"> This chain page is unclaimed </p>
        <p className="mb-5 text-muted-foreground text-sm">
          Are you the owner of this ecosystem? Claim this page to add additional
          information on this page to help your developers get started!
        </p>

        <Button variant="outline" asChild>
          <Link
            className="gap-2"
            href="https://share.hsforms.com/1qAViW3U5SoKbabNhRZy4Kgea58c"
            target="_blank"
          >
            <span>Claim Chain</span>
            <ExternalLinkIcon className="-mt-[3px] size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
