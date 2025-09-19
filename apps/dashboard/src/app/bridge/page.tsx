import { cn } from "@workspace/ui/lib/utils";
import type { Metadata } from "next";
import type { Address } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { getContract } from "thirdweb/contract";
import { getCurrencyMetadata } from "thirdweb/extensions/erc20";
import { AppFooter } from "@/components/footers/app-footer";
import { UniversalBridgeEmbed } from "./components/client/UniversalBridgeEmbed";
import { PageHeader } from "./components/header";
import { bridgeAppThirdwebClient } from "./constants";

const title = "thirdweb Payments: Swap, Bridge, and Onramp";
const description =
  "Swap, bridge, and on-ramp to any EVM chain with thirdweb's Payments.";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default async function BridgePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { chainId, tokenAddress, amount } = await searchParams;

  let symbol: string | undefined;
  let decimals: number | undefined;
  let tokenName: string | undefined;

  if (chainId && tokenAddress) {
    try {
      const metadata = await getCurrencyMetadata({
        contract: getContract({
          address: tokenAddress as Address,
          // eslint-disable-next-line no-restricted-syntax
          chain: defineChain(Number(chainId)),
          client: bridgeAppThirdwebClient,
        }),
      });
      ({ symbol, decimals, name: tokenName } = metadata);
    } catch (error) {
      console.warn("Failed to fetch token metadata:", error);
      // Continue with undefined values; the component should handle gracefully
    }
  }

  return (
    <div className="grow flex flex-col relative overflow-hidden">
      <PageHeader />

      <div className="flex grow flex-col items-center justify-center py-36 px-4 min-h-dvh relative overflow-hidden">
        <DotsBackgroundPattern />
        <UniversalBridgeEmbed
          amount={amount as string}
          chainId={chainId ? Number(chainId) : undefined}
          token={
            symbol && decimals && tokenName
              ? {
                  address: tokenAddress as Address,
                  name: tokenName,
                  symbol,
                }
              : undefined
          }
        />
      </div>

      <div className="bg-background relative z-10">
        <AppFooter />
      </div>
    </div>
  );
}

function DotsBackgroundPattern(props: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 text-foreground/30 dark:text-foreground/10",
        props.className,
      )}
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 50%)",
      }}
    />
  );
}
