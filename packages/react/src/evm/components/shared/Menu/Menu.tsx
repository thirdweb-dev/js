import { TwUiTheme } from "../../theme";
import styled from "@emotion/styled";

export interface MenuProps {}

export const Menu = styled.ul<MenuProps>`
  padding: 0;
  margin: 0;
  background: ${(props) => (props.theme as TwUiTheme).colors.background};
  color: ${(props) => (props.theme as TwUiTheme).colors.text};
  list-style: none;
  border-radius: 0.5em;
  overflow: hidden;
  position: relative;
  pointer-events: auto;
  &:focus {
    outline: 0;
  }
  &:after {
    content: "";
    position: absolute;
    border: 1px solid ${(props) => (props.theme as TwUiTheme).colors.accent};
    border-radius: 0.5em;
    pointer-events: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;
