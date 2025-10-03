"use client";
import { CheckIcon, CopyIcon as CopyIconSVG } from "@radix-ui/react-icons";
import { useClipboard } from "../hooks/useCopyClipboard.js";
import { Container } from "./basic.js";
import { ToolTip } from "./Tooltip.js";

/**
 * @internal
 */
export const CopyIcon: React.FC<{
  text: string;
  tip: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  hasCopied?: boolean;
  iconSize?: number;
}> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.text);
  const showCheckIcon = props.hasCopied || hasCopied;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: TODO
    <div
      onClick={onCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCopy();
        }
      }}
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <ToolTip align={props.align} side={props.side} tip={props.tip}>
        <div>
          <Container
            center="both"
            color={showCheckIcon ? "success" : undefined}
            flex="row"
          >
            {showCheckIcon ? (
              <CheckIcon
                className="tw-check-icon"
                width={props.iconSize || 16}
                height={props.iconSize || 16}
              />
            ) : (
              <CopyIconSVG
                className="tw-copy-icon"
                width={props.iconSize || 16}
                height={props.iconSize || 16}
              />
            )}
          </Container>
        </div>
      </ToolTip>
    </div>
  );
};
