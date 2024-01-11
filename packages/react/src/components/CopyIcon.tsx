import { useCustomTheme } from "../design-system/CustomThemeProvider";
import { useClipboard } from "../evm/components/hooks/useCopyClipboard";
import { ToolTip } from "./Tooltip";
import styled from "@emotion/styled";
import { CheckIcon, CopyIcon as CopyIconSVG } from "@radix-ui/react-icons";

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
    >
      <ToolTip tip={props.tip} side={props.side} align={props.align}>
        {props.hasCopied || hasCopied ? <CheckIconStyled /> : <CopyIconSVG />}
      </ToolTip>
    </div>
  );
};

const CheckIconStyled = /* @__PURE__ */ styled(CheckIcon)(() => {
  const theme = useCustomTheme();
  return {
    color: theme.colors.success,
  };
});
