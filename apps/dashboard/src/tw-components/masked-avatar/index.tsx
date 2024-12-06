import { Img } from "@/components/blocks/Img";
import { cn } from "@/lib/utils";
import hexagon from "./hexagon.png";

interface MaskedAvatarProps {
  src: string;
  isPending?: boolean;
  alt?: string;
  className?: string;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <Img
      className={cn("size-12 object-cover", className)}
      src={src}
      alt={alt}
      style={{
        WebkitMaskImage: `url("${hexagon.src}")`,
        WebkitMaskSize: "cover",
        mask: `url("${hexagon.src}")`,
        maskSize: "cover",
      }}
    />
  );
};
