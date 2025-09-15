"use client";
import { Spinner } from "@workspace/ui/components/spinner";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { ClientOnly } from "@/components/blocks/client-only";
import type { DexScreenerChainSlug } from "./dex-screener-chains";

function DexScreenerIframe(props: {
  chain: DexScreenerChainSlug;
  contractAddress: string;
}) {
  const { theme } = useTheme();

  const iframeUrl = useMemo(() => {
    const resolvedTheme = theme === "light" ? "light" : "dark";
    const url = new URL("https://dexscreener.com");
    url.pathname = `${props.chain}/${props.contractAddress}`;
    url.searchParams.set("embed", "1");
    url.searchParams.set("loadChartSettings", "0");
    url.searchParams.set("chartTheme", resolvedTheme);
    url.searchParams.set("theme", resolvedTheme);
    url.searchParams.set("trades", "1");
    url.searchParams.set("chartStyle", "1");
    url.searchParams.set("chartLeftToolbar", "0");
    url.searchParams.set("chartType", "usd");
    url.searchParams.set("interval", "15");
    url.searchParams.set("chartDefaultOnMobile", "1");
    return url.toString();
  }, [theme, props.chain, props.contractAddress]);

  return (
    <iframe
      className="w-full h-[500px] lg:h-[1000px] rounded-lg overflow-hidden border bg-card"
      src={iframeUrl}
      title="DexScreener"
    ></iframe>
  );
}

export function DexScreener(props: {
  chain: DexScreenerChainSlug;
  contractAddress: string;
}) {
  return (
    <ClientOnly
      ssr={
        <div className="w-full h-[500px] lg:h-[1000px] rounded-lg border bg-card items-center justify-center flex">
          <Spinner className="size-10" />
        </div>
      }
    >
      <DexScreenerIframe
        chain={props.chain}
        contractAddress={props.contractAddress}
      />
    </ClientOnly>
  );
}
