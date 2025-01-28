"use client";

import { useAccountContext } from "../../../../core/account/provider.js";
import { Blobbie, type BlobbieProps } from "../../ConnectWallet/Blobbie.js";

/**
 * A wrapper for the Blobbie component
 * @param props BlobbieProps
 * @beta
 * @wallet
 */
export function AccountBlobbie(props: Omit<BlobbieProps, "address">) {
  const { address } = useAccountContext();
  return <Blobbie {...props} address={address} />;
}
