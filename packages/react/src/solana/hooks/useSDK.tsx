import { ThirdwebSDKContext } from "../providers/ThirdwebSDKProvider";
import { useContext } from "react";

export function useSDK() {
  return useContext(ThirdwebSDKContext);
}
