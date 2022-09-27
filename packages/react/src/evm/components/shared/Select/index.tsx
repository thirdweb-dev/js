import { TwUiTheme } from "../../theme";
import { PropsOf } from "@emotion/react";
import styled from "@emotion/styled";
import color from "color";

export const Select = styled.select`
  margin: -0.25em 0;
  background: ${(props) =>
    color((props.theme as TwUiTheme).colors.background)
      .alpha(0.85)
      .hexa()};
  color: ${(props) => (props.theme as TwUiTheme).colors.text};
  border: 1px solid
    ${(props) =>
      color((props.theme as TwUiTheme).colors.text)
        .alpha(0.25)
        .hexa()};
  border-radius: 0.25em;
  padding: 0.25em;
  width: 100%;
  flex-shrink: 1;
  font-size: 1em;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    outline: 2px solid ${(props) => (props.theme as TwUiTheme).colors.accent};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export interface SelectProps extends PropsOf<typeof Select> {}
