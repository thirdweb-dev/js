import { ens, useReleaserProfile } from "../hooks";
import hexagon from "./hexagon.png";
import { Img, ImgProps } from "@chakra-ui/react";
import "react";

interface MaskedAvatarProps
  extends Omit<ImgProps, "as" | "viewBox" | "boxSize"> {
  src: string;
  name?: string;
  boxSize?: number;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  name,
  boxSize = 12,
  ...restBoxProps
}) => {
  return (
    <Img
      boxSize={boxSize}
      objectFit="contain"
      {...restBoxProps}
      style={{
        WebkitMaskImage: `url("${hexagon.src}")`,
        WebkitMaskSize: "cover",
        mask: `url("${hexagon.src}")`,
        maskSize: "cover",
      }}
      src={src}
      alt={name || ""}
    />
  );
};

interface ReleaserAvatar extends Omit<MaskedAvatarProps, "src"> {
  address: string;
}

export const ReleaserAvatar: React.FC<ReleaserAvatar> = ({
  address,
  ...restProps
}) => {
  const ensQuery = ens.useQuery(address);
  const releaserProfile = useReleaserProfile(
    ensQuery.data?.address || undefined,
  );
  return (
    <MaskedAvatar
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
