"use client";

import { XIcon } from "lucide-react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { Button } from "../ui/button";

export function DismissibleAlert(props: {
  title: React.ReactNode;
  description: React.ReactNode;
  localStorageId: string;
}) {
  const [isVisible, setIsVisible] = useLocalStorage(
    props.localStorageId,
    true,
    false,
  );

  if (!isVisible) return null;

  return (
    <div className="relative rounded-lg border border-border bg-card p-4">
      <Button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 h-auto w-auto p-1 text-muted-foreground"
        aria-label="Close alert"
        variant="ghost"
      >
        <XIcon className="size-5" />
      </Button>
      <div>
        <h2 className="mb-0.5 font-semibold">{props.title} </h2>
        <div className="text-muted-foreground text-sm">{props.description}</div>
      </div>
    </div>
  );
}
