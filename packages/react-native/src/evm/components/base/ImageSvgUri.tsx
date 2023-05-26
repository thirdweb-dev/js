import { resolveIpfsUri } from "@thirdweb-dev/react-core";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

const ImageSvgUri = ({
  imageUrl = "",
  width,
  height,
  imageAlt = "",
}: {
  imageUrl: string;
  width: number;
  height: number;
  imageAlt?: string;
}) => {
  const isSvg = imageUrl.toLowerCase().endsWith(".svg");
  const resolvedImageUrl = resolveIpfsUri(imageUrl) || "";

  if (!resolvedImageUrl || resolvedImageUrl === "") {
    return null;
  }

  if (isSvg) {
    return <SvgUri width={width} height={height} uri={resolvedImageUrl} />;
  } else {
    return (
      <Image
        alt={imageAlt}
        source={{ uri: resolvedImageUrl }}
        style={[{ width: width, height: height }]}
      />
    );
  }
};

export default ImageSvgUri;
