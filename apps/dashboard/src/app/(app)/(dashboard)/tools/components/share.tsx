import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const ShareButton = ({ cta, href }: { cta: string; href: string }) => {
  return (
    <Button asChild variant="outline">
      <Link
        className="items-center gap-2"
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {cta} <ExternalLinkIcon className="size-3 text-muted-foreground" />
      </Link>
    </Button>
  );
};
