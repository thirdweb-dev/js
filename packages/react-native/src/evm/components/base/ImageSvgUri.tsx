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
  const resolvedImageUrl = resolveIpfsUri(imageUrl) || "";

  const [error, setError] = useState(false);

  if (!resolvedImageUrl || resolvedImageUrl === "") {
    return null;
  }

  if (error) {
    return (
      <SvgUri
        width={width}
        height={height}
        uri={resolvedImageUrl}
        onError={() => setError(true)}
      />
    );
  } else {
    // always try to render Image first, if error then try to render svg
    // Image from RN handles onError better than SvgUri
    return (
      <Image
        alt={imageAlt}
        source={{ uri: resolvedImageUrl }}
        style={[{ width: width, height: height }]}
        onError={() => setError(true)}
      />
    );
  }
};

export default ImageSvgUri;
