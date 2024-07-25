import { MediaRenderer } from "src/exports/react.js";
import {
  type ResolveAvatarOptions,
  resolveAvatar,
} from "../../../../../extensions/ens/resolve-avatar.js";
import type { MediaRendererProps } from "../../MediaRenderer/types.js";

/**
 * Props for the EnsAvatar component.
 * It's the combination of MediaRendererProps & ResolveAvatarOptions - type EnsAvatarProps = MediaRendererProps & ResolveAvatarOptions
 * 
 * please look up those 2 types for better context
 */
export type EnsAvatarProps = MediaRendererProps & ResolveAvatarOptions;

/**
 * This component returns a [`MediaRenderer`](https://portal.thirdweb.com/references/typescript/v5/MediaRenderer) component -
 * showing the avatar of a given ENS name.
 *
 * Since it is a wrapper around <MediaRenderer />, you can customize its style just like how you do the <MediaRenderer /> component.
 *
 * This component by default is a React server component.
 * Learn more about RSCs and how to use them [here](https://react.dev/reference/rsc/server-components)
 *
 * @example
 * ```tsx
 * import { EnsAvatar } from "thirdweb/react";
 *
 * <EnsAvatar
 *   name="vitalik.eth"
 *   client={...} // thirdweb Client
 *   width="100px"
 *   height="100px"
 * />
 * ```
 * 
 */
export async function EnsAvatar(props: EnsAvatarProps) {
  const { name } = props;
  if (!name) {
    throw new Error("Props `name` was not provided");
  }
  if (!name.endsWith(".eth")) {
    throw new Error("Invalid ENS. name must end with .eth | e.g 'vitalik.eth'");
  }
  const src = await resolveAvatar(props);
  return <MediaRenderer src={src} {...props} />;
}
