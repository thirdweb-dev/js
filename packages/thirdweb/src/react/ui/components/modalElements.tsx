import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledH2 } from "../design-system/elements.js";
import { fontSize, media, iconSize } from "../design-system/index.js";
import { IconButton } from "./buttons.js";

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

// UNUSED
// type ModalDescriptionProps = {
//   centerOnMobile?: boolean;
//   sm?: boolean;
// };

// const ModalDescription = /* @__PURE__ */ StyledP(
//   (props: ModalDescriptionProps) => {
//     const theme = useCustomTheme();
//     return {
//       all: "unset",
//       display: "block",
//       fontSize: props.sm ? fontSize.sm : fontSize.md,
//       color: theme.colors.secondaryText,
//       lineHeight: 1.5,
//       [media.mobile]: {
//         textAlign: props.centerOnMobile ? "center" : "left",
//       },
//     };
//   },
// );

/**
 * @internal
 */
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

// UNUSED
// const HelperLink = /* @__PURE__ */ StyledAnchor(
//   (props: { md?: boolean }) => {
//     const theme = useCustomTheme();
//     return {
//       all: "unset",
//       cursor: "pointer",
//       color: theme.colors.accentText,
//       fontSize: props.md ? fontSize.md : fontSize.sm,
//       textDecoration: "none",
//       display: "block",
//       lineHeight: 1.5,
//       [media.mobile]: {
//         textAlign: "center",
//       },
//       "&:hover": {
//         color: theme.colors.primaryText,
//         textDecoration: "none",
//       },
//     };
//   },
// );
