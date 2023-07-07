import { resolveIpfsUri } from "@thirdweb-dev/react-core";
import { useState } from "react";
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
  const isSvg =
    imageUrl.toLowerCase().endsWith(".svg") ||
    !imageUrl.toLowerCase().endsWith(".png") ||
    !imageUrl.toLowerCase().endsWith(".jpg");
  const resolvedImageUrl = resolveIpfsUri(imageUrl) || "";

  const [error, setError] = useState(false);

  if (!resolvedImageUrl || resolvedImageUrl === "") {
    return null;
  }

  // always try to render svg if we cannot detect the url extension
  // if error then try to render regular image
  if (isSvg || error) {
    return (
      <SvgUri
        width={width}
        height={height}
        uri={resolvedImageUrl}
        onError={() => setError(true)}
      />
    );
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
