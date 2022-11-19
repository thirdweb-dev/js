import { useEns, useReleaserProfile } from "../hooks";
import hexagon from "./hexagon.png";
import { Img, ImgProps, Skeleton } from "@chakra-ui/react";
import "react";

interface MaskedAvatarProps
  extends Omit<ImgProps, "as" | "viewBox" | "boxSize"> {
  src: string;
  isLoading?: boolean;
  name?: string;
  boxSize?: number;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  name,
  boxSize = 12,
  isLoading,
  ...restBoxProps
}) => {
  return (
    <Skeleton
      isLoaded={!isLoading}
      style={{
        WebkitMaskImage: `url("${hexagon.src}")`,
        WebkitMaskSize: "cover",
        mask: `url("${hexagon.src}")`,
        maskSize: "cover",
      }}
      boxSize={boxSize}
    >
      <Img
        boxSize={boxSize}
        objectFit="cover"
        {...restBoxProps}
        src={src}
        alt={name || ""}
      />
    </Skeleton>
  );
};

export interface ReleaserAvatarProps extends Omit<MaskedAvatarProps, "src"> {
  address: string;
}

export const ReleaserAvatar: React.FC<ReleaserAvatarProps> = ({
  address,
  isLoading,
  ...restProps
}) => {
  const ensQuery = useEns(address);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  return (
    <MaskedAvatar
      isLoading={isLoading || ensQuery.isLoading || releaserProfile.isLoading}
      src={
        releaserProfile.data?.avatar ||
        `https://source.boringavatars.com/marble/120/${
          ensQuery.data?.ensName || ensQuery.data?.address
        }?colors=264653,2a9d8f,e9c46a,f4a261,e76f51&square=true`
      }
      {...restProps}
    />
  );
};
