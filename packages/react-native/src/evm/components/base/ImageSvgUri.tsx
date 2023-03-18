import { resolveIpfsUri } from "@thirdweb-dev/react-core";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

const ImageSvgUri = ({
  imageUrl,
  width,
  height,
}: {
  imageUrl: string;
  width: number;
  height: number;
}) => {
  const isSvg = imageUrl.toLowerCase().endsWith(".svg");
  const resolvedImageUrl = resolveIpfsUri(imageUrl) || "";

  if (isSvg) {
    return <SvgUri width={width} height={height} uri={resolvedImageUrl} />;
  } else {
    return (
      <Image
        source={{ uri: resolvedImageUrl }}
        style={[{ width: width, height: height }]}
      />
    );
  }
};

export default ImageSvgUri;
