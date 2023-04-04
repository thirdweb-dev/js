import { Theme } from "../design-system";
import { useClipboard } from "../evm/components/hooks/useCopyClipboard";
import { ToolTip } from "./Tooltip";
import styled from "@emotion/styled";
import { CheckIcon, CopyIcon as CopyIconSVG } from "@radix-ui/react-icons";

export const CopyIcon: React.FC<{
  text: string;
  tip: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
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
    >
      <ToolTip tip={props.tip} side={props.side} align={props.align}>
        {hasCopied ? <CheckIconStyled /> : <CopyIconSVG />}
      </ToolTip>
    </div>
  );
};

const CheckIconStyled = styled(CheckIcon)<{ theme?: Theme }>`
  color: ${(p) => p.theme.icon.success};
`;
