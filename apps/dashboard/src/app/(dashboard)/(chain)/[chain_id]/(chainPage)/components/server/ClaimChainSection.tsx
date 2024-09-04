import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { SectionTitle } from "./SectionTitle";

export function ClaimChainSection() {
  return (
    <section>
      <SectionTitle title="Claim Chain" />
      <div className="border p-4 rounded-lg bg-muted/50">
        <p className="mb-1"> This chain page is unclaimed </p>
        <p className="text-muted-foreground text-sm mb-5">
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
            <ExternalLinkIcon className="size-4 -mt-[3px]" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
