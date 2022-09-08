import { useEffect } from "react";

export function useOgImagePing(ogImageUrl?: string): void {
  useEffect(() => {
    let img: HTMLImageElement | null = null;
    if (ogImageUrl) {
      img = new Image(1, 1);
      img.src = ogImageUrl;
      img.className = "og-image-ping";
      img.style.opacity = "0";
      img.style.position = "absolute";
      img.style.top = "-9999px";
      img.style.left = "-9999px";
      img.style.width = "1px";
      img.style.height = "1px";
      img.style.visibility = "hidden";
      img.style.pointerEvents = "none";

      img.onload = () => {
        if (img) {
          try {
            document.body.removeChild(img);
          } catch (err) {
            // this may fail but that's ok
          }
        }
      };
      document.body.appendChild(img);
      return () => {
        if (img) {
          // set this to a no-op so that the onload handler doesn't try to remove it after we already removed it
          img.onload = () => undefined;
          try {
            document.body.removeChild(img);
          } catch (err) {
            // this may fail but that's fine
          }
        }
      };
    }
  }, [ogImageUrl]);
}
