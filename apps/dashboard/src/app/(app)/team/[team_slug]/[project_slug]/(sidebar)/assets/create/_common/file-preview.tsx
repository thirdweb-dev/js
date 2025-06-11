import { Img } from "@/components/blocks/Img";
import { fileToBlobUrl } from "@/lib/file-to-url";
import { cn } from "@/lib/utils";
import { ImageOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export function FilePreview(props: {
  srcOrFile: File | string | undefined;
  fallback?: React.ReactNode;
  className?: string;
  client: ThirdwebClient;
  imgContainerClassName?: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string>("");

  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    if (props.srcOrFile instanceof File) {
      const url = fileToBlobUrl(props.srcOrFile);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof props.srcOrFile === "string") {
      setObjectUrl(props.srcOrFile);
    } else {
      setObjectUrl("");
    }
  }, [props.srcOrFile]);

  // shortcut just for images
  const isImage =
    props.srcOrFile instanceof File &&
    props.srcOrFile.type.startsWith("image/");

  if (!objectUrl) {
    return (
      <div className={cn("flex items-center justify-center", props.className)}>
        <ImageOffIcon className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (isImage) {
    return (
      <Img
        src={objectUrl}
        className={props.className}
        fallback={props.fallback}
        containerClassName={props.imgContainerClassName}
      />
    );
  }

  return (
    <MediaRenderer
      src={objectUrl}
      client={props.client}
      className={cn(props.className, "[&>div]:!bg-muted")}
    />
  );
}
