import { SkeletonContainer } from "../../@/components/ui/skeleton";
import { cn } from "../../@/lib/utils";
import hexagon from "./hexagon.png";

export interface MaskedAvatarProps {
  src: string;
  isLoading?: boolean;
  alt?: string;
  boxSize?: number;
  className?: string;
}

export const MaskedAvatar: React.FC<MaskedAvatarProps> = ({
  src,
  alt,
  boxSize = 12,
  isLoading,
  className,
}) => {
  return (
    <SkeletonContainer
      className={cn(className, `size-${boxSize}`)}
      style={{
        WebkitMaskImage: `url("${hexagon.src}")`,
        WebkitMaskSize: "cover",
        mask: `url("${hexagon.src}")`,
        maskSize: "cover",
      }}
      skeletonData={false}
      loadedData={isLoading}
      render={() => (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="object-cover" src={src} alt={alt || ""} />
      )}
    />
  );
};
