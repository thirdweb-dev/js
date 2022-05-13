import { PossibleButtonSize, buttonSizesMap } from "./button";
import { convertFontSizeToCSSVar } from "./utils/typography";
import {
  MenuGroup as ChakraMenuGroup,
  MenuGroupProps as ChakraMenuGroupProps,
  MenuItem as ChakraMenuItem,
  MenuItemProps as ChakraMenuItemProps,
  forwardRef,
  useButtonGroup,
} from "@chakra-ui/react";
import {
  LabelBase,
  LabelSizes,
  TypographySize,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "theme/typography";
import { ComponentWithChildren } from "types/component-with-children";

export interface MenuGroupProps
  extends Omit<ChakraMenuGroupProps, "size" | "title"> {
  size?: LabelSizes;
  title: JSX.Element;
}

export const MenuGroup: ComponentWithChildren<MenuGroupProps> = ({
  size = "label.lg",
  title,
  ...restProps
}) => {
  const [base] = size.split(".") as [LabelBase, TypographySize];

  return (
    <ChakraMenuGroup
      fontSize={convertFontSizeToCSSVar(size)}
      fontWeight={fontWeights[base]}
      lineHeight={lineHeights[base]}
      letterSpacing={letterSpacings[base]}
      // trick chakra, this works fine
      title={title as unknown as string}
      {...restProps}
    />
  );
};

export interface MenuItemProps extends Omit<ChakraMenuItemProps, "size"> {
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
