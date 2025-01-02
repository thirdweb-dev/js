"use client";
import { keyframes } from "@emotion/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize, radius } from "../../../core/design-system/index.js";
import { fadeInAnimation } from "../design-system/animations.js";
import { StyledDiv } from "../design-system/elements.js";
import { DynamicHeight } from "./DynamicHeight.js";
import { CrossContainer } from "./Modal.js";
import { Container } from "./basic.js";
import { IconButton } from "./buttons.js";

type DrawerProps = {
  children: React.ReactNode;
  close: () => void;
};
/**
 *
 * @internal
 */
export const Drawer = /* @__PURE__ */ forwardRef<HTMLDivElement, DrawerProps>(
  function Drawer_(props, ref) {
    return (
      <DrawerContainer ref={ref}>
        <DynamicHeight>
          <Container p="lg">
            <CrossContainer>
              <IconButton
                type="button"
                aria-label="Close"
                onClick={props.close}
              >
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
          </Container>
        </DynamicHeight>
      </DrawerContainer>
    );
  },
);

const DrawerContainer = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    zIndex: 10000,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    background: theme.colors.modalBg,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    animation: `${drawerOpenAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1)`,
    borderTop: `1px solid ${theme.colors.borderColor}`,
  };
});

const drawerOpenAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const DrawerOverlay = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    backgroundColor: theme.colors.modalOverlayBg,
    zIndex: 9999,
    position: "absolute",
    inset: 0,
    animation: `${fadeInAnimation} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  };
});

/**
 *
 * @internal
 */
export function useDrawer() {
  const [isOpen, _setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerOverlayRef = useRef<HTMLDivElement>(null);

  const closeDrawerAnimation = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (drawerRef.current) {
        const animOptions = {
          easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
          fill: "forwards",
          duration: 300,
        } as const;

        const closeAnimation = drawerRef.current.animate(
          [{ transform: "translateY(100%)", opacity: 0 }],
          animOptions,
        );

        drawerOverlayRef.current?.animate([{ opacity: 0 }], animOptions);
        closeAnimation.onfinish = () => resolve();
      } else {
        resolve();
      }
    });
  }, []);

  const setIsOpen = useCallback(
    async (value: boolean) => {
      if (value) {
        _setIsOpen(true);
      } else {
        await closeDrawerAnimation();
        _setIsOpen(false);
      }
    },
    [closeDrawerAnimation],
  );

  // close on outside click
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        event.target instanceof Node &&
        !drawerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // avoid listening to the click event that opened the drawer by adding a frame delay
    requestAnimationFrame(() => {
      document.addEventListener("click", handleClick);
    });

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen, setIsOpen]);

  return {
    drawerRef,
    drawerOverlayRef,
    setIsOpen,
    isOpen,
  };
}
