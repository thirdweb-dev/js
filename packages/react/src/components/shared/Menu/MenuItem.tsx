import { TwUiTheme } from "../../theme";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import color from "color";
import { PropsWithChildren } from "react";

export interface MenuItemBaseProps {
  isSelectable?: boolean;
}

const MenuItemBase = styled.li<MenuItemBaseProps>`
  display: flex;
  padding: 0.75em 1em;
  align-items: center;
  gap: 0.5em;
  font-size: 1em;

  ${(props) =>
    props.isSelectable
      ? `&:hover,
  &[data-focus] {
    cursor: pointer;
    background: ${color((props.theme as TwUiTheme).colors.text)
      .alpha(0.15)
      .hexa()};
  }`
      : ``}

  > svg {
    flex-shrink: 0;
  }
`;

export interface MenuItemProps extends PropsOf<typeof MenuItemBase> {
  leftElement?: JSX.Element;
  rightElement?: JSX.Element;
}

export const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({
  children,
  leftElement,
  rightElement,
  isSelectable = true,
  onClick,
  ...restProps
}) => {
  return (
    <MenuItemBase
      {...restProps}
      onClick={isSelectable ? onClick : undefined}
      isSelectable={isSelectable}
    >
      {leftElement}
      {children}
      {rightElement}
    </MenuItemBase>
  );
};
