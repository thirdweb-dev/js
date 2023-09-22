import { useStorage } from "@thirdweb-dev/react-core";
import { useState } from "react";
import { Image } from "react-native";
import { SvgUri, SvgXml } from "react-native-svg";
import { isAppBundleIdPresentInGlobal } from "../../utils/global";
import Box from "./Box";

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
    return (
      <Box style={{ width: width, height: height }}>
        <SvgXml width={width} height={height} xml={imageUrl} />
      </Box>
    );
  }

  const resolvedImageUrl = storage
    ? storage.resolveScheme(imageUrl) +
      (isAppBundleIdPresentInGlobal()
        ? `?bundleId=${(globalThis as any).APP_BUNDLE_ID as string}`
        : "")
    : imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");

  if (!resolvedImageUrl || resolvedImageUrl === "") {
    return null;
  }

  return (
    <Box style={{ width: width, height: height }}>
      {error ? (
        <SvgUri
          width={width}
          height={height}
          uri={resolvedImageUrl}
          onError={(err) => {
            console.warn("Error loading an svg image: ", err);
          }}
        />
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
