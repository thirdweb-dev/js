"use client";
import { useTrack } from "hooks/analytics/useTrack";
import { FileText } from "lucide-react";
import Link from "next/link";
import type { ChainMetadata } from "thirdweb/chains";
import { SectionTitle } from "../server/SectionTitle";

export default function NextSteps(props: { chain: ChainMetadata }) {
  const { chain } = props;
  const trackEvent = useTrack();

  return (
    <section>
      <SectionTitle title="Next Steps" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="relative flex gap-3 rounded-lg border bg-card p-4 pr-8 transition-colors hover:border-active-border">
          <FileText className="mt-0.5 size-5 shrink-0" />
          <div>
            <h3 className="mb-1.5 font-medium">
              <Link
                href={
                  "https://blog.thirdweb.com/supercharge-user-adoption-integrate-embedded-wallets-in-minutes/"
                }
                className="before:absolute before:inset-0"
                target="_blank"
                onClick={() =>
                  trackEvent({
                    category: "nextSteps",
                    action: "click-inapp",
                    label: "success",
                    chain_id: chain.chainId,
                  })
                }
              >
                Create a login for {chain.name}
              </Link>
            </h3>
            <p className="text-muted-foreground text-sm">
              Supercharge User Adoption—Integrate In-App Wallets in Minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
