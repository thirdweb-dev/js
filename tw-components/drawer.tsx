import {
  Drawer as ChakraDrawer,
  DrawerProps as ChakraDrawerProps,
  Divider,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  ModalBodyProps,
  ModalFooterProps,
  ModalHeaderProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ComponentWithChildren } from "types/component-with-children";

export interface DrawerProps extends Omit<ChakraDrawerProps, "placement"> {
  header?: ModalHeaderProps;
  drawerBodyProps?: ModalBodyProps;
  footer?: ModalFooterProps;
  hideCloseButton?: true;
}

export const Drawer: ComponentWithChildren<DrawerProps> = ({
  children,
  header,
  drawerBodyProps,
  footer,
  hideCloseButton,
  ...restDrawerProps
}) => {
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: "md" },
  );
  return (
    <ChakraDrawer
      {...restDrawerProps}
      allowPinchZoom
      preserveScrollBarGap
      placement={isMobile ? "bottom" : "right"}
    >
      <DrawerOverlay zIndex="modal" />
      <DrawerContent
        maxH="calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
        // maxW="calc(100vw - env(safe-area-inset-left) - env(safe-area-inset-right))"
        overflow="hidden"
        borderTopRadius={{ base: "lg", md: "none" }}
      >
        {!hideCloseButton && <DrawerCloseButton />}
        {header && (
          <>
            <DrawerHeader {...header} />
            <Divider />
          </>
        )}
        <DrawerBody {...drawerBodyProps} py={4}>
          {children}
        </DrawerBody>
        {footer && (
          <>
            <Divider />
            <DrawerFooter {...footer} />
          </>
        )}
      </DrawerContent>
    </ChakraDrawer>
  );
};
