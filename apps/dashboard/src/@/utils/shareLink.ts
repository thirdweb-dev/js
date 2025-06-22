import { toast } from "sonner";

// if browser supports sharing use native sharing - use that, else just copy to clipboard + show toast
export async function shareLink(_data: ShareData) {
  const data = { ..._data, url: _data.url || window.location.href };

  if (
    "canShare" in navigator &&
    navigator.canShare &&
    navigator.canShare(data)
  ) {
    await navigator.share(data);
  } else {
    await navigator.clipboard.writeText(data.url);
    toast.info("URL copied to clipboard");
  }
}
