import { Image, type ImgProps, Skeleton } from "@chakra-ui/react";
import hexagon from "./hexagon.png";

export interface MaskedAvatarProps
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
      <Image
        boxSize={boxSize}
        objectFit="cover"
        {...restBoxProps}
        src={src}
        alt={name || ""}
      />
    </Skeleton>
  );
};
