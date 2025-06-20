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
import { Container } from "./basic.js";
import { IconButton } from "./buttons.js";
import { DynamicHeight } from "./DynamicHeight.js";
import { CrossContainer } from "./Modal.js";

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
                aria-label="Close"
                onClick={props.close}
                type="button"
              >
                <Cross2Icon
                  height={iconSize.md}
                  style={{
                    color: "inherit",
                  }}
                  width={iconSize.md}
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
    animation: `${drawerOpenAnimation} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1)`,
    background: theme.colors.modalBg,
    borderTop: `1px solid ${theme.colors.borderColor}`,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 10000,
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
    animation: `${fadeInAnimation} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
    backgroundColor: theme.colors.modalOverlayBg,
    inset: 0,
    position: "absolute",
    zIndex: 9999,
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
          duration: 300,
          easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
          fill: "forwards",
        } as const;

        const closeAnimation = drawerRef.current.animate(
          [{ opacity: 0, transform: "translateY(100%)" }],
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
    drawerOverlayRef,
    drawerRef,
    isOpen,
    setIsOpen,
  };
}
