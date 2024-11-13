"use client";

import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { useMutation } from "@tanstack/react-query";
import { ArrowRightIcon, CheckIcon, OrbitIcon, ShareIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function JoinNebulaWaitlistPageUI(props: {
  onWaitlist: boolean;
  joinWaitList: () => Promise<void>;
}) {
  const router = useDashboardRouter();

  return (
    <div className="flex grow flex-col">
      {/* Header */}
      <div className="border-b py-10">
        <div className="container flex items-center justify-between">
          <h1 className="font-semibold text-3xl tracking-tight"> Nebula </h1>
          <Button asChild variant="outline">
            <Link href="/contact-us" target="_blank">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>

      <div className="container flex grow flex-col overflow-hidden pt-32 pb-48">
        {props.onWaitlist ? (
          <CenteredCard
            key="on-waitlist"
            title="You're on the waitlist"
            description="You should receive access to Nebula soon!"
            footer={<ShareButton />}
          />
        ) : (
          <CenteredCard
            key="not-on-waitlist"
            title="Nebula"
            description="Blockchain-first AI that can read & write onchain in realtime."
            footer={
              <JoinWaitingListButton
                joinWaitList={props.joinWaitList}
                onSuccess={() => {
                  router.refresh();
                }}
              />
            }
          />
        )}
      </div>
    </div>
  );
}

function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <ToolTipLabel label="Copy Page Link">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => {
          navigator.clipboard.writeText("https://thirdweb.com/team/~/~/nebula");
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1000);
        }}
      >
        Share
        {isCopied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <ShareIcon className="size-4" />
        )}
      </Button>
    </ToolTipLabel>
  );
}

function JoinWaitingListButton(props: {
  joinWaitList: () => Promise<void>;
  onSuccess: () => void;
}) {
  const joinWaitListMutation = useMutation({
    mutationFn: props.joinWaitList,
    onSuccess: props.onSuccess,
  });

  return (
    <Button
      className="gap-2 rounded-full"
      variant="primary"
      onClick={() => {
        const promise = joinWaitListMutation.mutateAsync();
        toast.promise(promise, {
          success: "Joined the waitlist!",
          error: "Failed to join waitlist",
        });
      }}
    >
      Join the waitlist
      {joinWaitListMutation.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <ArrowRightIcon className="size-4" />
      )}
    </Button>
  );
}

function CenteredCard(props: {
  footer: React.ReactNode;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="flex grow flex-col items-center justify-center max-sm:px-4">
      <div className="relative flex min-h-[480px] w-full flex-col rounded-xl border bg-muted/50 p-2 lg:w-[480px]">
        {/* fancy borders */}
        <div className="">
          {/* top */}
          <DashedBgDiv
            className="-translate-x-1/2 -translate-y-5 absolute top-0 right-0 left-1/2 h-[1px] w-[calc(100%+200px)]"
            type="horizontal"
          />
          {/* bottom */}
          <DashedBgDiv
            className="-translate-x-1/2 absolute right-0 bottom-0 left-1/2 h-[1px] w-[calc(100%+200px)] translate-y-5"
            type="horizontal"
          />
          {/* left */}
          <DashedBgDiv
            className="-translate-x-5 -translate-y-1/2 absolute top-1/2 left-0 h-[calc(100%+200px)] w-[1px]"
            type="vertical"
          />
          {/* right */}
          <DashedBgDiv
            className="-translate-y-1/2 absolute top-1/2 right-0 h-[calc(100%+200px)] w-[1px] translate-x-5"
            type="vertical"
          />
        </div>

        <div className="flex grow items-center justify-center rounded-lg border p-4">
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="rounded-xl border p-1">
              <div className="rounded-lg border bg-muted/50 p-2">
                <OrbitIcon className="size-5 text-muted-foreground" />
              </div>
            </div>

            <div className="h-4" />

            <h2 className="text-balance text-center font-semibold text-2xl tracking-tight md:text-3xl">
              {props.title}
            </h2>

            <div className="h-2" />

            <p className="text-center text-muted-foreground lg:px-8">
              {props.description}
            </p>

            <div className="h-6" />

            {props.footer}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashedBgDiv(props: {
  className?: string;
  type: "horizontal" | "vertical";
}) {
  return (
    <div
      className={props.className}
      style={{
        backgroundImage: `linear-gradient(${props.type === "horizontal" ? "90deg" : "180deg"}, hsl(var(--foreground)/20%) 0 30%, transparent 0 100%)`,
        backgroundRepeat: "repeat",
        backgroundSize: "10px 10px",
        maskImage: `linear-gradient(${
          props.type === "horizontal" ? "to right" : "to bottom"
        }, rgba(0,0,0,0.1), black 20%, black 80%, rgba(0,0,0,0.1))`,
      }}
    />
  );
}
