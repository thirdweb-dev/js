import { useMemo } from "react";
import { Image } from "react-native";
import { SvgXml } from "react-native-svg";
import { radius } from "../../design-system/index.js";

export type ImageInfo = {
  size: number;
  data?: string | null;
  placeholder?: string;
  color?: string;
};

function getImage(data: string): {
  image: string;
  type: "xml" | "image" | "url";
} {
  if (data.startsWith("data:image/svg+xml;base64,")) {
    const image = globalThis.atob(
      data.replace("data:image/svg+xml;base64,", ""),
    );
    return { image, type: "xml" };
  }
  if (data.startsWith("data:image/")) {
    return { image: data, type: "image" };
  }
  if (data.startsWith("<svg")) {
    return { image: data, type: "xml" };
  }
  return { image: data, type: "url" };
}

export const RNImage = (props: ImageInfo) => {
  const { data, size, color, placeholder } = props;
  if (!data) {
    return null;
  }
  const { image, type } = useMemo(() => getImage(data), [data]);
  switch (type) {
    case "url":
      return (
        <Image
          source={{ uri: image }}
          loadingIndicatorSource={{ uri: placeholder }}
          width={size}
          height={size}
          style={{ borderRadius: radius.md }}
        />
      );
    case "image":
      return (
        <Image
          source={{ uri: image }}
          style={{ width: size, height: size, borderRadius: radius.md }}
        />
      );
    case "xml":
      return <SvgXml xml={image} width={size} height={size} color={color} />;
    default:
      return null;
  }
};
