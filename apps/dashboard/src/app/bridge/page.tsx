import type { Metadata } from "next";
import { BridgePageUI } from "./components/bridge-page";

const title = "thirdweb Bridge: Buy, Bridge & Swap Crypto on 85+ Chains";
const description =
  "Bridge and swap 4500+ tokens across 85+ chains (Ethereum, Base, Optimism, Arbitrum, BNB & more). Best-price routing with near-instant finality";

export const metadata: Metadata = {
  description,
  openGraph: {
    description,
    title,
  },
  title,
};

export default function Page() {
  return (
    <BridgePageUI
      buyTab={undefined}
      swapTab={undefined}
      title={
        <h1 className="text-3xl md:text-6xl font-semibold tracking-tighter text-balance text-center">
          Bridge and Swap tokens <br className="max-sm:hidden" /> across any
          chain, instantly
        </h1>
      }
    />
  );
}
