"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { ExternalLinkIcon, RefreshCcwIcon, XIcon } from "lucide-react";
import Link from "next/link";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ThirdwebClient } from "thirdweb";
import type { ExamplePrompt } from "../../data/examplePrompts";
import { NebulaIcon } from "../../icons/NebulaIcon";

const LazyFloatingChatContent = lazy(() => import("./FloatingChatContent"));

export function NebulaFloatingChatButton(props: {
  authToken: string | undefined;
  examplePrompts: ExamplePrompt[];
  account: Account | undefined;
  label: string;
  client: ThirdwebClient;
  nebulaParams:
    | {
        messagePrefix: string;
        chainIds: number[];
        wallet: string | undefined;
      }
    | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-1.5">
          <Button
            onClick={() => {
              setIsOpen(true);
              setHasBeenOpened(true);
            }}
            variant="default"
            className="gap-2 rounded-full"
          >
            <NebulaIcon className="size-4" />
            {props.label}
          </Button>
          <Button
            variant="outline"
            className="size-10 rounded-full bg-card p-0"
            onClick={() => setIsDismissed(true)}
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      )}

      <NebulaChatUIContainer
        onClose={closeModal}
        isOpen={isOpen}
        hasBeenOpened={hasBeenOpened}
        authToken={props.authToken}
        account={props.account}
        client={props.client}
        nebulaParams={props.nebulaParams}
        examplePrompts={props.examplePrompts}
      />
    </>
  );
}

function NebulaChatUIContainer(props: {
  onClose: () => void;
  isOpen: boolean;
  hasBeenOpened: boolean;
  authToken: string | undefined;
  account: Account | undefined;
  examplePrompts: ExamplePrompt[];
  client: ThirdwebClient;
  nebulaParams:
    | {
        messagePrefix: string;
        chainIds: number[];
        wallet: string | undefined;
      }
    | undefined;
}) {
  const ref = useOutsideClick(props.onClose);
  const shouldRenderChat = props.isOpen || props.hasBeenOpened;
  const [nebulaSessionKey, setNebulaSessionKey] = useState(0);

  return (
    <div
      className={cn(
        "slide-in-from-bottom-20 zoom-in-95 fade-in-0 fixed bottom-0 left-0 z-50 flex h-[80vh] w-[100vw] animate-in flex-col overflow-hidden rounded-t-2xl border bg-background shadow-2xl duration-200 lg:right-6 lg:bottom-6 lg:left-auto lg:h-[80vh] lg:max-w-xl lg:rounded-xl",
        !props.isOpen && "hidden",
      )}
      ref={ref}
    >
      <div className="flex items-center justify-between border-b p-4">
        <Link
          className="group flex items-center gap-2"
          target="_blank"
          href="https://thirdweb.com/nebula"
        >
          <h2 className="font-semibold text-lg tracking-tight">Nebula</h2>
          <ExternalLinkIcon className="size-4 text-muted-foreground/70 group-hover:text-foreground" />
        </Link>

        <div className="flex items-center gap-2">
          <ToolTipLabel label="Reset chat">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNebulaSessionKey((prev) => prev + 1)}
              className="h-auto w-auto p-1 text-muted-foreground"
            >
              <RefreshCcwIcon className="size-5" />
            </Button>
          </ToolTipLabel>

          <ToolTipLabel label="Close chat">
            <Button
              variant="ghost"
              size="icon"
              onClick={props.onClose}
              className="h-auto w-auto p-1 text-muted-foreground"
            >
              <XIcon className="size-5" />
            </Button>
          </ToolTipLabel>
        </div>
      </div>

      {/* once opened keep the component mounted to preserve the states */}
      <div className="relative flex grow flex-col overflow-hidden">
        {shouldRenderChat && (
          <Suspense
            fallback={
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="size-10" />
              </div>
            }
          >
            <LazyFloatingChatContent
              authToken={props.authToken}
              account={props.account}
              client={props.client}
              nebulaParams={props.nebulaParams}
              key={nebulaSessionKey}
              examplePrompts={props.examplePrompts}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function useOutsideClick(onOutsideClick: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  // clicking outside the chat window should close it
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // if clicked on a dialog or popover - ignore
        if (
          (event.target as HTMLElement).closest(
            "[data-radix-popper-content-wrapper], [role='dialog'], [data-state='open']",
          )
        ) {
          return;
        }
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onOutsideClick]);

  return ref;
}
