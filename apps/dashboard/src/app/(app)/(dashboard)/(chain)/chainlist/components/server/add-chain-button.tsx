import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AddYourChainButton(props: { className?: string }) {
  return (
    <Button asChild className={props.className} variant="default">
      <Link
        className="flex items-center gap-2"
        href="https://share.hsforms.com/1XDi-ieM9Rl6oIkn7ynK6Lgea58c"
        rel="noopener noreferrer"
        target="_blank"
      >
        <PlusIcon className="size-4" />
        Add your chain
      </Link>
    </Button>
  );
}
