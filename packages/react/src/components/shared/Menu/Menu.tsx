import { TwUiTheme } from "../../theme";
import styled from "@emotion/styled";

export interface MenuProps {}

export const Menu = styled.ul<MenuProps>`
  padding: 0;
  margin: 0;
  background: ${(props) => (props.theme as TwUiTheme).colors.background};
  color: ${(props) => (props.theme as TwUiTheme).colors.text};
  outline-color: ${(props) => (props.theme as TwUiTheme).colors.accent};
  outline-style: solid;
  outline-offset: 0px;
  list-style: none;
  border-radius: 0.5em;
  overflow: hidden;
`;
