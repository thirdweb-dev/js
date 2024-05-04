"use client";
import { CheckIcon, CopyIcon as CopyIconSVG } from "@radix-ui/react-icons";
import { useClipboard } from "../hooks/useCopyClipboard.js";
import { ToolTip } from "./Tooltip.js";
import { Container } from "./basic.js";

/**
 * @internal
 */
export const CopyIcon: React.FC<{
  text: string;
  tip: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  hasCopied?: boolean;
}> = (props) => {
  const { hasCopied, onCopy } = useClipboard(props.text);

  return (
    <div
      onClick={onCopy}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCopy();
        }
      }}
    >
      <ToolTip tip={props.tip} side={props.side} align={props.align}>
        {props.hasCopied || hasCopied ? (
          <Container color="success">
            <CheckIcon />
          </Container>
        ) : (
          <CopyIconSVG />
        )}
      </ToolTip>
    </div>
  );
};
