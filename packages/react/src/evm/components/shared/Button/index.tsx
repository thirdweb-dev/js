import { TwUiTheme } from "../../theme";
import { Spinner } from "../Spinner";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import color from "color";
import { PropsWithChildren } from "react";

interface BaseButtonProps {
  hasRightElement?: boolean;
  hasLeftElement?: boolean;
  isLoading?: boolean;
}

const BaseButton = styled.button<BaseButtonProps>`
  position: relative;
  border-radius: 0.5em;
  padding: 0.75em 1.25em;
  padding-right: ${(props) => (props.hasRightElement ? "0.75em" : "1.25em")};
  padding-left: ${(props) => (props.hasLeftElement ? "0.75em" : "1.25em")};
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: flex;
  gap: 0.5em;
  align-items: center;
  justify-content: space-evenly;
  color: ${(props) =>
    computeTextColorBasedOnBackground(
      (props.theme as TwUiTheme).colors.accent,
    )};
  border: 2px solid
    ${(props) => computeHoverColor((props.theme as TwUiTheme).colors.accent)};
  &:hover {
    cursor: pointer;
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:focus {
    outline: 2px solid ${(props) => (props.theme as TwUiTheme).colors.accent};
    outline-offset: 1px;
  }
`;

function computeHoverColor(c: string) {
  const col = color(c);

  if (col.hex() === "#000000") {
    return "#262627";
  }
  if (col.luminosity() < 0.2) {
    return col.lighten(0.1).hex();
  }
  return col.darken(0.1).hex();
}

function computeDisabledColor(c: string) {
  const col = color(c);

  if (col.hex() === "#000000") {
    return "#262627";
  }
  if (col.luminosity() < 0.2) {
    return col.lighten(0.5).hex();
  }
  return col.darken(0.5).hex();
}

function computeTextColorBasedOnBackground(c: string) {
  const col = color(c);

  if (col.isDark()) {
    return "#fff";
  }
  return "#000";
}

const SolidButton = styled(BaseButton)`
  background: ${(props) => (props.theme as TwUiTheme).colors.accent};
  &:hover {
    background: ${(props) =>
      computeHoverColor((props.theme as TwUiTheme).colors.accent)};
    border-color: ${(props) =>
      computeHoverColor((props.theme as TwUiTheme).colors.accent)};
  }
  &:disabled {
    background: ${(props) =>
      computeDisabledColor((props.theme as TwUiTheme).colors.accent)};
    border-color: ${(props) =>
      computeDisabledColor((props.theme as TwUiTheme).colors.accent)};
    color: ${(props) =>
      computeTextColorBasedOnBackground(
        computeDisabledColor((props.theme as TwUiTheme).colors.accent),
      )};
  }
`;

const OutlineButton = styled(BaseButton)`
  background: transparent;
  &:hover {
    background: ${(props) =>
      color((props.theme as TwUiTheme).colors.background)
        .alpha(0.5)
        .hexa()};
  }
`;

export interface ButtonProps
  extends Omit<
    PropsOf<typeof BaseButton>,
    "hasRightElement" | "hasLeftElement"
  > {
  variant?: "solid" | "outline";
  isDisabled?: boolean;
  leftElement?: JSX.Element;
  rightElement?: JSX.Element;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  variant,
  rightElement,
  leftElement,
  isLoading,
  isDisabled,
  disabled,
  ...restProps
}) => {
  const Btn = variant === "outline" ? OutlineButton : SolidButton;

  return (
    <Btn
      {...restProps}
      disabled={isDisabled || disabled || isLoading}
      hasRightElement={!!rightElement}
      hasLeftElement={!!leftElement}
    >
      {isLoading ? (
        <Spinner
          style={{
            position: "absolute",
            left: "calc(50% - 0.75em / 2)",
          }}
        />
      ) : null}
      <span
        style={{
          opacity: isLoading ? 0 : 1,
          display: "inherit",
          gap: "inherit",
          alignItems: "inherit",
          justifyContent: "inherit",
          width: "100%",
        }}
      >
        {leftElement}
        {children}
        {rightElement}
      </span>
    </Btn>
  );
};
