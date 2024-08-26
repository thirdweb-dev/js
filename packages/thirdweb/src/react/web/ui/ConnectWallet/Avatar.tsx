import type React from "react";
import type { ThirdwebClient } from "src/client/client.js";
import { useEnsAvatar, useEnsName } from "src/react/core/utils/wallet.js";
import type { Address } from "viem";
import { Blobbie } from "./Blobbie.js";

export type AvatarProps = {
  client: ThirdwebClient;
  walletAddress?: Address;
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
        props.walletAddress && (
          <Blobbie address={props.walletAddress} style={props.style} />
        )
      )}
    </>
  );
}
