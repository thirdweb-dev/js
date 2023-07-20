import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { createContext } from "react";

export interface TWSDKContext {
  sdk?: ThirdwebSDK;
  _inProvider?: true;
}

export const ThirdwebSDKContext = /* @__PURE__ */ createContext<TWSDKContext>(
  {},
);
