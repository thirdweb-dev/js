import { useStorage } from "@thirdweb-dev/react-core";

export const Img: React.FC<{
  width?: string;
  height?: string;
  src: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
  style?: React.CSSProperties;
}> = (props) => {
  const storage = useStorage();

  const getSrc = () => {
    try {
      return storage
        ? storage.resolveScheme(props.src)
        : props.src.replace("ipfs://", "https://ipfs.io/ipfs/");
    } catch {
      return props.src;
    }
  };

  return (
    <img
      width={props.width}
      height={props.height}
      src={getSrc()}
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
    />
  );
};
