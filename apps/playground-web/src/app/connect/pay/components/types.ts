import type { Address, Chain } from "thirdweb";
import type { ThemeOverrides } from "thirdweb/react";

export type BridgeComponentsPlaygroundOptions = {
  theme: {
    type: "dark" | "light";
    darkColorOverrides: ThemeOverrides["colors"];
    lightColorOverrides: ThemeOverrides["colors"];
  };
  payOptions: {
    widget?: "buy" | "checkout" | "transaction";
    title: string | undefined;
    image: string | undefined;
    description: string | undefined;

    buyTokenAddress?: Address;
    buyTokenAmount: string;
    buyTokenChain: Chain;

    // direct_payment mode options
    sellerAddress: Address;

    // transaction mode options
    transactionData?: string; // Simplified for demo; could be more complex in real implementation
  };
};
