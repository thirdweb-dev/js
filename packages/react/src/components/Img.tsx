const ipfsGateway = "https://gateway.ipfscdn.io/ipfs/";

export const Img: React.FC<{
  width: string;
  height: string;
  src: string;
  alt?: string;
  loading?: "eager" | "lazy";
}> = (props) => {
  const src = props.src.startsWith("ipfs://")
    ? ipfsGateway + props.src.replace("ipfs://", "")
    : props.src;

  return (
    <img
      width={props.width}
      height={props.height}
      src={src}
      alt={props.alt || ""}
      loading={props.loading}
      decoding="async"
    />
  );
};
