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
  return (
    <img
      width={props.width}
      height={props.height}
      src={
        storage
          ? storage.resolveScheme(props.src)
          : props.src.replace("ipfs://", "https://ipfs.io/ipfs/")
      }
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
