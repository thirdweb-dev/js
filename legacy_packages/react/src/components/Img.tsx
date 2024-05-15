import { useStorage } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Skeleton } from "./Skeleton";

export const Img: React.FC<{
  width?: string;
  height?: string;
  src?: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
  style?: React.CSSProperties;
  fallbackImage?: string;
}> = (props) => {
  const storage = useStorage();
  const [isLoaded, setIsLoaded] = useState(false);

  const propSrc = props.src;

  const widthPx = props.width + "px";
  const heightPx = (props.height || props.width) + "px";

  if (!propSrc) {
    return <Skeleton width={widthPx} height={heightPx} />;
  }

  const getSrc = () => {
    if (!props.src) {
      return props.fallbackImage || "";
    }
    try {
      return storage
        ? storage.resolveScheme(props.src)
        : props.src.replace("ipfs://", "https://ipfs.io/ipfs/");
    } catch {
      return props.src;
    }
  };

  const src = getSrc();

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
      }}
    >
      {!isLoaded && <Skeleton width={widthPx} height={heightPx} />}
      <img
        onLoad={() => {
          setIsLoaded(true);
        }}
        key={src}
        width={props.width}
        height={props.height}
        src={src}
        alt={props.alt || ""}
        loading={props.loading}
        decoding="async"
        style={{
          objectFit: "contain",
          height: !isLoaded
            ? 0
            : props.height
              ? props.height + "px"
              : undefined,
          width: !isLoaded ? 0 : props.width ? props.width + "px" : undefined,
          userSelect: "none",
          visibility: isLoaded ? "visible" : "hidden",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease",
          ...props.style,
        }}
        draggable={false}
        className={props.className}
        onError={(e) => {
          if (
            props.fallbackImage &&
            e.currentTarget.src !== props.fallbackImage
          ) {
            e.currentTarget.src = props.fallbackImage;
          }
        }}
      />
    </div>
  );
};
