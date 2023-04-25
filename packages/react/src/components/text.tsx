import styled from "@emotion/styled";
import { fontSize, Theme } from "../design-system";

export const SecondaryText = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
  margin: 0;
`;

export const NeutralText = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.neutral};
  margin: 0;
`;

export const DangerText = styled.span<{ theme?: Theme }>`
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.danger};
  margin: 0;
`;
