import styled from "@emotion/styled";
import { fontSize, Theme } from "../design-system";

export const TextDivider = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.text.secondary};
  font-size: ${fontSize.sm};
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(p) => p.theme.bg.highlighted};
  }

  span {
    margin: 0 1rem;
  }
`;
