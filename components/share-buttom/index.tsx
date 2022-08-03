import { Icon, useClipboard, useToast } from "@chakra-ui/react";
import { FiCheck, FiShare2 } from "react-icons/fi";
import { TrackedIconButton } from "tw-components";

export const ShareButton: React.FC<Required<Omit<ShareData, "files">>> = (
  shareData,
) => {
  const { onCopy, hasCopied } = useClipboard(shareData.url);
  const toast = useToast();
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
        console.error(err);
      }
    }
    onCopy();
    toast({
      position: "bottom",
      title: "URL copied to clipboard",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
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
    </>
  );
};
