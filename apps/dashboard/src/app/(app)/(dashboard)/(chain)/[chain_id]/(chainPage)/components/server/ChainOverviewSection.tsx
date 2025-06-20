import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { ChainLiveStats } from "../client/live-stats";
import { PrimaryInfoItem } from "./primary-info-item";
import { SectionTitle } from "./SectionTitle";

export function ChainOverviewSection(props: { chain: ChainMetadata }) {
  const { chain } = props;
  return (
    <section>
      <SectionTitle title="Chain Overview" />
      <div className="grid grid-cols-1 gap-6 rounded-lg border bg-card p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3 lg:gap-8">
        {/* Info */}
        {chain.infoURL && (
          <PrimaryInfoItem title="Info">
            <Link
              className="inline-flex items-center gap-1.5 hover:text-link-foreground"
              href={chain.infoURL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {new URL(chain.infoURL).hostname}
              <ExternalLinkIcon className="size-4" />
            </Link>
          </PrimaryInfoItem>
        )}

        {/* Chain Id */}
        <PrimaryInfoItem title="Chain ID">
          <CopyTextButton
            className="-translate-x-2 px-2 py-1 text-base"
            copyIconPosition="right"
            iconClassName="size-4"
            textToCopy={chain.chainId.toString()}
            textToShow={chain.chainId.toString()}
            tooltip="Copy Chain ID"
            variant="ghost"
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
