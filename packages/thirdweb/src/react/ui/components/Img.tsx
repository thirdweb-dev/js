/* eslint-disable @next/next/no-img-element */
import { resolveScheme } from "../../../utils/ipfs.js";
import { useThirdwebProviderProps } from "../../hooks/others/useThirdwebProviderProps.js";

/**
 * @internal
 */
export const Img: React.FC<{
  width?: string;
  height?: string;
  src: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
  style?: React.CSSProperties;
  fallbackImage?: string;
}> = (props) => {
  const { client } = useThirdwebProviderProps();

  const getSrc = () => {
    try {
      return resolveScheme({
        uri: props.src,
        client: client,
      });
    } catch {
      return props.src;
    }
  };

  const src = getSrc();

  return (
    <img
      key={src}
      width={props.width}
      height={props.height}
      src={src}
      alt={props.alt || ""}
      loading={props.loading}
      decoding="async"
      style={{
        height: props.height ? props.height + "px" : undefined,
        width: props.width ? props.width + "px" : undefined,
        userSelect: "none",
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
  );
};
