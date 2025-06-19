import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export const ShareButton = ({
  cta,
  href,
}: {
  cta: string;
  href: string;
}) => {
  return (
    <Button asChild variant="outline">
      <Link
        href={href}
        className="items-center gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {cta} <ExternalLinkIcon className="size-3 text-muted-foreground" />
      </Link>
    </Button>
  );
};
