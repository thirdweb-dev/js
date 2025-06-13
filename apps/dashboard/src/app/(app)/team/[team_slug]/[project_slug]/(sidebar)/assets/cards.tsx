"use client";

import { cn } from "@/lib/utils";
import { ImportModal } from "components/contract-components/import-contract/modal";

import { ArrowDownToLineIcon, CoinsIcon, ImagesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";

export function Cards(props: {
  teamSlug: string;
  projectSlug: string;
  client: ThirdwebClient;
  teamId: string;
  projectId: string;
}) {
  const [importModalOpen, setImportModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ImportModal
        client={props.client}
        isOpen={importModalOpen}
        onClose={() => {
          setImportModalOpen(false);
        }}
        teamId={props.teamId}
        projectId={props.projectId}
        type="asset"
      />

      <CardLink
        title="Create Coin"
        description="Launch your own ERC-20 coin"
        href={`/team/${props.teamSlug}/${props.projectSlug}/assets/create/token`}
        icon={CoinsIcon}
        trackingLabel="create-token"
      />

      <CardLink
        title="Create NFT Collection"
        description="Launch your own NFT collection"
        href={`/team/${props.teamSlug}/${props.projectSlug}/assets/create/nft`}
        icon={ImagesIcon}
        trackingLabel="create-nft"
      />

      <CardLink
        title="Import Existing Asset"
        description="Import tokens or NFTs you own to the project"
        href={undefined}
        icon={ArrowDownToLineIcon}
        trackingLabel="import-asset"
        onClick={() => {
          setImportModalOpen(true);
        }}
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
  trackingLabel: string;
}) {
  const { onClick } = props;
  const isClickable = !!onClick || !!props.href;

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border bg-card p-4",
        isClickable && "cursor-pointer hover:border-active-border ",
      )}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick();
              }
            }
          : undefined
      }
    >
      <div className="mb-4 flex">
        <div className="flex items-center justify-center rounded-full border p-2.5">
          <props.icon className="size-5 text-muted-foreground" />
        </div>
      </div>

      <h3 className="mb-0.5 font-semibold text-lg tracking-tight">
        {props.href ? (
          <Link href={props.href} className="before:absolute before:inset-0">
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
