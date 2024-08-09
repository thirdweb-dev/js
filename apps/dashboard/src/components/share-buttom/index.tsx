import { Icon, useClipboard } from "@chakra-ui/react";
import { FiCheck, FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import { TrackedIconButton } from "tw-components";

export const ShareButton: React.FC<ShareData> = (props) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const url = props.url || currentUrl;
  const shareData = { ...props, url };
  const { onCopy, hasCopied } = useClipboard(shareData.url);

  const onShareClick = async () => {
    // if browser supports sharing use native sharing
    if (
      "canShare" in navigator &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.warn("failed to share", err);
      }
    } else {
      onCopy();
      toast.info("URL copied to clipboard");
    }
  };

  return (
    <TrackedIconButton
      variant="ghost"
      aria-label="copy-url"
      icon={
        <Icon
          boxSize={5}
          color={hasCopied ? "green.500" : "inherit"}
          as={hasCopied ? FiCheck : FiShare2}
        />
      }
      category="released-contract"
      label="copy-url"
      onClick={onShareClick}
    />
  );
};
