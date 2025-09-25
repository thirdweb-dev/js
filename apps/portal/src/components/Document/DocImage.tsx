/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { cn } from "@/lib/utils";

export function DocImage(props: {
  src: React.ComponentProps<typeof Image>["src"];
  alt?: string;
  className?: string;
  containerClassName?: string;
}) {
  const { alt, src } = props;
  const cls = cn("rounded-lg w-full", props.className);

  return (
    <div
      className={cn(
        "my-4 flex justify-center rounded-lg border border-dashed p-4",
        props.containerClassName,
      )}
    >
      {typeof src === "string" ? (
        <img alt={alt || ""} className={cls} src={src} />
      ) : (
        <Image alt={alt || ""} className={cls} src={src} />
      )}
    </div>
  );
}
