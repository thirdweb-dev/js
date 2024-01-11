import { useStorage } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Image } from "react-native";
import { SvgUri, SvgXml } from "react-native-svg";
import Box from "./Box";
import { appBundleId } from "../../utils/version";

/**
 * @internal
 */
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
  const storage = useStorage();
  const [error, setError] = useState(false);

  if (imageUrl.startsWith("<svg")) {
    return <SvgXml width={width} height={height} xml={imageUrl} />;
  }

  const resolvedImageUrl = storage
    ? storage.resolveScheme(imageUrl) + `?bundleId=${appBundleId}`
    : imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");

  if (!resolvedImageUrl || resolvedImageUrl === "") {
    return null;
  }

  return (
    <Box width={width} height={height}>
      {error ? (
        <SvgUri width={width} height={height} uri={resolvedImageUrl} />
      ) : (
        // always try to render Image first, if error then try to render svg
        // Image from RN handles onError better than SvgUri
        <Image
          alt={imageAlt}
          source={{ uri: resolvedImageUrl }}
          style={[{ width: width, height: height }]}
          onError={() => setError(true)}
        />
      )}
    </Box>
  );
};

export default ImageSvgUri;
