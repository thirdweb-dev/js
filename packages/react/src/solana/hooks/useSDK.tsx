import { TWSolanaContext } from "../providers/ThirdwebSDKProvider";
import { useContext } from "react";

export function useSDK() {
  return useContext(TWSolanaContext);
}
