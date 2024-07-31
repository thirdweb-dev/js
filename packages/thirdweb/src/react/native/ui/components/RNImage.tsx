import { useMemo, useState } from "react";
import { Image } from "react-native";
import { SvgXml } from "react-native-svg";
import type { Theme } from "../../../core/design-system/index.js";
import { radius } from "../../design-system/index.js";
import { Skeleton } from "./Skeleton.js";

export type ImageInfo = {
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
  const [loading, setLoading] = useState(true);
  if (!data) {
    return null;
  }
  const { image, type } = useMemo(() => getImage(data), [data]);
  switch (type) {
    case "url":
    case "image":
      return (
        <>
          {loading && (
            <Skeleton
              theme={props.theme}
              style={{ width: size, height: size }}
            />
          )}
          <Image
            source={{ uri: image }}
            loadingIndicatorSource={{ uri: placeholder }}
            width={size}
            height={size}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            style={[
              { borderRadius: radius.md, display: loading ? "none" : "flex" },
            ]}
          />
        </>
      );
    case "xml":
      return <SvgXml xml={image} width={size} height={size} color={color} />;
    default:
      return null;
  }
};
