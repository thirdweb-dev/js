"use client";
import { spacing } from "../../../core/design-system/index.js";
import { useClipboard } from "../hooks/useCopyClipboard.js";
import { IconButton } from "./buttons.js";
import { Text } from "./text.js";

/**
 * @internal
 */
export const CopyAddress: React.FC<{
  addressOrEns: string;
}> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.addressOrEns);

  return (
    <IconButton
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCopy();
        }
      }}
      onClick={onCopy}
      style={{ padding: `${spacing["4xs"]} ${spacing.xxs}` }}
    >
      <Text
        color={hasCopied ? "primaryText" : "secondaryText"}
        weight={400}
        size="sm"
      >
        {hasCopied ? "Copied address!" : props.addressOrEns}
      </Text>
    </IconButton>
  );
};
