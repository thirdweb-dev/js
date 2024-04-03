import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";
import { iconSize, radius, spacing } from "../design-system/index.js";
import { keyframes } from "@emotion/react";
import { IconButton } from "./buttons.js";

import { Cross2Icon } from "@radix-ui/react-icons";
import { CrossContainer } from "./Modal.js";

/**
 *
 * @internal
 */
export function Drawer(props: {
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <>
      <DrawerOverlay />
      <DrawerContainer>
        <CrossContainer>
          <IconButton type="button" aria-label="Close">
            <Cross2Icon
              width={iconSize.md}
              height={iconSize.md}
              style={{
                color: "inherit",
              }}
            />
          </IconButton>
        </CrossContainer>

        {props.children}
      </DrawerContainer>
    </>
  );
}

const DrawerContainer = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    zIndex: 10000,
    padding: spacing.lg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    background: theme.colors.modalBg,
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    animation: `${drawerOpenAnimation} 0.3s ease`,
  };
});

export const drawerOpenAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DrawerOverlay = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    backgroundColor: theme.colors.modalOverlayBg,
    zIndex: 9999,
    position: "absolute",
    inset: 0,
    animation: `${fadeInAnimation} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  };
});
