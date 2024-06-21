import {
  MenuItem as ChakraMenuItem,
  type MenuItemProps as ChakraMenuItemProps,
  forwardRef,
  useButtonGroup,
} from "@chakra-ui/react";
import { fontWeights, letterSpacings, lineHeights } from "theme/typography";
import { type PossibleButtonSize, buttonSizesMap } from "./button";
import { convertFontSizeToCSSVar } from "./utils/typography";

interface MenuItemProps extends Omit<ChakraMenuItemProps, "size"> {
  size?: Exclude<PossibleButtonSize, "xs">;
}

export const MenuItem = forwardRef<MenuItemProps, "button">(
  ({ size, ...restButtonprops }, ref) => {
    const { size: groupSize, ...buttonGroupContext } = useButtonGroup() || {};
    let _size: Exclude<PossibleButtonSize, "xs"> = (size ||
      groupSize ||
      "md") as Exclude<PossibleButtonSize, "xs">;
    if (!(_size in buttonSizesMap)) {
      _size = "md";
    }

    const props: MenuItemProps = {
      fontWeight: fontWeights.subtitle,
      lineHeight: lineHeights.label,
      letterSpacing: letterSpacings.body,
      fontSize: convertFontSizeToCSSVar(`label.${_size}`),
      size: _size,
      ...buttonGroupContext,
      ...restButtonprops,
    };

    return <ChakraMenuItem {...props} ref={ref} />;
  },
);

MenuItem.displayName = "MenuItem";
