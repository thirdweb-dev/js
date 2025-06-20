"use client";

import { ImportModal } from "components/contract-components/import-contract/modal";
import { ArrowDownToLineIcon, CoinsIcon, ImagesIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  reportAssetCreationStarted,
  reportAssetImportStarted,
  reportAssetImportSuccessful,
} from "@/analytics/report";
import { cn } from "@/lib/utils";

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
        onSuccess={() => {
          reportAssetImportSuccessful();
        }}
        projectId={props.projectId}
        teamId={props.teamId}
        type="asset"
      />

      <CardLink
        description="Launch your own ERC-20 coin"
        href={`/team/${props.teamSlug}/${props.projectSlug}/assets/create/token`}
        icon={CoinsIcon}
        onClick={() => {
          reportAssetCreationStarted({
            assetType: "coin",
          });
        }}
        title="Create Coin"
      />

      <CardLink
        description="Launch your own NFT collection"
        href={`/team/${props.teamSlug}/${props.projectSlug}/assets/create/nft`}
        icon={ImagesIcon}
        onClick={() => {
          reportAssetCreationStarted({
            assetType: "nft",
          });
        }}
        title="Create NFT Collection"
      />

      <CardLink
        description="Import tokens or NFTs you own to the project"
        href={undefined}
        icon={ArrowDownToLineIcon}
        onClick={() => {
          reportAssetImportStarted();
          setImportModalOpen(true);
        }}
        title="Import Existing Asset"
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
        <div className="flex items-center justify-center rounded-full border p-2.5">
          <props.icon className="size-5 text-muted-foreground" />
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
