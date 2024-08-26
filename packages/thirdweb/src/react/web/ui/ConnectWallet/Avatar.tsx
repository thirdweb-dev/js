import type React from "react";
import type { Address } from "viem";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  useEnsAvatar,
  useEnsName,
} from "../../../../react/core/utils/wallet.js";
import { Blobbie } from "./Blobbie.js";

export type AvatarProps = {
  client: ThirdwebClient;
  walletAddress: Address;
  style?: React.CSSProperties;
  className?: string;
};

/**
 *
 * @component
 * @returns An image for the wallet address.
 */
export function Avatar(props: AvatarProps) {
  const ensNameQuery = useEnsName({
    client: props.client,
    address: props.walletAddress,
  });

  const ensAvatarQuery = useEnsAvatar({
    client: props.client,
    ensName: ensNameQuery.data,
  });

  return (
    <>
      {ensAvatarQuery.data ? (
        <img
          alt=""
          src={ensAvatarQuery.data}
          style={props.style}
          className={props.className}
        />
      ) : (
        <Blobbie address={props.walletAddress} style={props.style} />
      )}
    </>
  );
}
