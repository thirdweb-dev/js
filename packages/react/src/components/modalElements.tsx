import { fontSize, media } from "../design-system";
import { iconSize } from "../design-system";
import { useCustomTheme } from "../design-system/CustomThemeProvider";
import { StyledAnchor, StyledH2, StyledP } from "../design-system/elements";
import { IconButton } from "./buttons";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export const ModalTitle = /* @__PURE__ */ StyledH2(
  (props: { centerOnMobile?: boolean }) => {
    const theme = useCustomTheme();
    return {
      margin: 0,
      fontWeight: 600,
      fontSize: fontSize.lg,
      color: theme.colors.primaryText,
      lineHeight: 1.3,
      textAlign: "left",
      [media.mobile]: {
        textAlign: props.centerOnMobile ? "center" : "left",
      },
    };
  },
);

type ModalDescriptionProps = {
  centerOnMobile?: boolean;
  sm?: boolean;
};

export const ModalDescription = /* @__PURE__ */ StyledP(
  (props: ModalDescriptionProps) => {
    const theme = useCustomTheme();
    return {
      all: "unset",
      display: "block",
      fontSize: props.sm ? fontSize.sm : fontSize.md,
      color: theme.colors.secondaryText,
      lineHeight: 1.5,
      [media.mobile]: {
        textAlign: props.centerOnMobile ? "center" : "left",
      },
    };
  },
);

export const BackButton: React.FC<{
  onClick: () => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <IconButton
      onClick={props.onClick}
      style={{ transform: "translateX(-25%)", ...props.style }}
      type="button"
    >
      <ChevronLeftIcon width={iconSize.md} height={iconSize.md} />
    </IconButton>
  );
};

export const HelperLink = /* @__PURE__ */ StyledAnchor(
  (props: { md?: boolean }) => {
    const theme = useCustomTheme();
    return {
      all: "unset",
      cursor: "pointer",
      color: theme.colors.accentText,
      fontSize: props.md ? fontSize.md : fontSize.sm,
      textDecoration: "none",
      display: "block",
      lineHeight: 1.5,
      [media.mobile]: {
        textAlign: "center",
      },
      "&:hover": {
        color: theme.colors.primaryText,
        textDecoration: "none",
      },
    };
  },
);
