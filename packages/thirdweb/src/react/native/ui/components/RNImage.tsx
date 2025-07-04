import { useMemo } from "react";
import { Image } from "react-native";
import { SvgXml } from "react-native-svg";
import type { Theme } from "../../../core/design-system/index.js";
import { radius } from "../../design-system/index.js";

type ImageInfo = {
  size: number;
  theme: Theme;
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

  const imageResult = useMemo(() => {
    if (!data) {
      return undefined;
    }
    return getImage(data);
  }, [data]);

  if (!imageResult) {
    return null;
  }

  const { image, type } = imageResult;
  switch (type) {
    case "url":
    case "image":
      return (
        <Image
          height={size}
          loadingIndicatorSource={{ uri: placeholder }}
          source={{ uri: image }}
          style={[{ borderRadius: radius.md }]}
          width={size}
        />
      );
    case "xml":
      return <SvgXml color={color} height={size} width={size} xml={image} />;
    default:
      return null;
  }
};
