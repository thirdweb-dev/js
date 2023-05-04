import { resolveIpfsUri } from "@thirdweb-dev/react-core";

export const Img: React.FC<{
  width: string;
  height: string;
  src: string;
  alt?: string;
  loading?: "eager" | "lazy";
  className?: string;
}> = (props) => {
  return (
    <img
      width={props.width}
      height={props.height}
      src={resolveIpfsUri(props.src)}
      alt={props.alt || ""}
      loading={props.loading}
      decoding="async"
      style={{
        height: props.height + "px",
        width: props.width + "px",
      }}
      className={props.className}
    />
  );
};
