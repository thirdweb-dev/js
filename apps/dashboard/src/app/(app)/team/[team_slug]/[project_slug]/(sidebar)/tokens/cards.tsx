"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowDownToLineIcon, CoinsIcon, ImagesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  reportAssetImportStarted,
  reportAssetImportSuccessful,
} from "@/analytics/report";
import { ImportModal } from "@/components/contracts/import-contract/modal";
import { cn } from "@/lib/utils";

export function ImportTokenButton(props: {
  client: ThirdwebClient;
  projectId: string;
  projectSlug: string;
  teamId: string;
  teamSlug: string;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="gap-2 rounded-full bg-card"
        size="sm"
        onClick={() => {
          reportAssetImportStarted();
          setImportModalOpen(true);
        }}
      >
        <ArrowDownToLineIcon className="size-3.5 text-muted-foreground" />
        Import Token
      </Button>

      <ImportModal
        allowedContractType="token"
        client={props.client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        onSuccess={() => {
          reportAssetImportSuccessful();
        }}
        projectId={props.projectId}
        projectSlug={props.projectSlug}
        teamId={props.teamId}
        teamSlug={props.teamSlug}
        type="asset"
      />
    </>
  );
}

export function Cards(props: {
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  teamId: string;
  projectId: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <CardLink
        description="Launch your own ERC-20 coin"
        href={`/team/${props.teamSlug}/${props.projectSlug}/tokens/create/token`}
        icon={CoinsIcon}
        title="Create Coin"
      />

      <CardLink
        description="Launch your own NFT collection"
        href={`/team/${props.teamSlug}/${props.projectSlug}/tokens/create/nft`}
        icon={ImagesIcon}
        title="Create NFT Collection"
      />
    </div>
  );
}

function CardLink(props: {
  title: string;
  description: string;
  href: string | undefined;
  onClick?: () => void;
  icon: React.FC<{ className?: string }>;
}) {
  const { onClick } = props;
  const isClickable = !!onClick || !!props.href;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: FIXME
    <div
      className={cn(
        "relative flex flex-col rounded-lg border bg-card p-4",
        isClickable && "cursor-pointer hover:border-active-border ",
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="mb-4 flex">
        <div className="flex items-center justify-center rounded-full border p-2">
          <props.icon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        {props.href ? (
          <Link className="before:absolute before:inset-0" href={props.href}>
            {props.title}
          </Link>
        ) : (
          <span>{props.title}</span>
        )}
      </h3>
      <p className="text-muted-foreground text-sm">{props.description}</p>
    </div>
  );
}
