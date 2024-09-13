import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function AddYourChainButton(props: { className?: string }) {
  return (
    <Button asChild variant="default" className={props.className}>
      <Link
        href="https://share.hsforms.com/1XDi-ieM9Rl6oIkn7ynK6Lgea58c"
        target="_blank"
        className="flex items-center gap-2"
      >
        <PlusIcon className="size-4" />
        Add your chain
      </Link>
    </Button>
  );
}
