"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function DismissibleAlert(
  props: {
    title: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    description: React.ReactNode;
    children?: React.ReactNode;
  } & (
    | {
        preserveState: true;
        localStorageId: string;
      }
    | {
        preserveState: false;
      }
  ),
) {
  if (props.preserveState) {
    return <DismissibleAlertWithLocalStorage {...props} />;
  }

  return <DismissibleAlertWithoutLocalStorage {...props} />;
}

function DismissibleAlertWithLocalStorage(props: {
  title: React.ReactNode;
  header?: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  localStorageId: string;
}) {
  const [isVisible, setIsVisible] = useLocalStorage(
    props.localStorageId,
    true,
    false,
  );

  if (!isVisible) return null;

  return <AlertUI {...props} onClose={() => setIsVisible(false)} />;
}

function DismissibleAlertWithoutLocalStorage(props: {
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return <AlertUI {...props} onClose={() => setIsVisible(false)} />;
}

function AlertUI(props: {
  title: React.ReactNode;
  header?: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClose: () => void;
}) {
  return (
    <div className={props.className}>
      <div className="relative rounded-lg border border-border bg-card p-4 lg:p-6 overflow-hidden">
        <Button
          aria-label="Close alert"
          className="absolute top-4 right-4 h-auto w-auto p-1 text-muted-foreground"
          onClick={props.onClose}
          variant="ghost"
        >
          <XIcon className="size-5" />
        </Button>
        <div>
          {props.header}
          <h2 className="mb-0.5 font-semibold">{props.title} </h2>
          <div className="text-muted-foreground text-sm">
            {props.description}
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
