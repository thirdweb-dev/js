import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import type { ChainMetadata } from "thirdweb/chains";
import { ChainLiveStats } from "../client/live-stats";
import { SectionTitle } from "./SectionTitle";
import { PrimaryInfoItem } from "./primary-info-item";

export function ChainOverviewSection(props: { chain: ChainMetadata }) {
  const { chain } = props;
  return (
    <section>
      <SectionTitle title="Chain Overview" />
      <div className="grid grid-cols-1 gap-6 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Info */}
        {chain.infoURL && (
          <PrimaryInfoItem title="Info">
            <div className="flex items-center gap-1.5 hover:text-primary">
              <Link href={chain.infoURL} target="_blank">
                {new URL(chain.infoURL).hostname}
              </Link>
              <ExternalLinkIcon className="size-4" />
            </div>
          </PrimaryInfoItem>
        )}

        {/* Chain Id */}
        <PrimaryInfoItem title="Chain ID">
          <CopyTextButton
            textToCopy={chain.chainId.toString()}
            textToShow={chain.chainId.toString()}
            tooltip="Copy Chain ID"
            variant="ghost"
            className="-translate-x-2 py-0.5"
            copyIconPosition="right"
          />
        </PrimaryInfoItem>

        {/* Native token */}
        <PrimaryInfoItem title="Native Token">
          {chain.nativeCurrency.name} ({chain.nativeCurrency.symbol})
        </PrimaryInfoItem>

        {chain.rpc[0] && <ChainLiveStats rpc={chain.rpc[0]} />}
      </div>
    </section>
  );
}
