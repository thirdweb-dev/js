import styled from "@emotion/styled";
import { fontSize, spacing, Theme } from "../design-system";

export const TextDivider = (props: {
  text: string;
  py?: keyof typeof spacing;
}) => {
  return (
    <TextDividerEl
      style={{
        paddingBlock: props.py ? spacing[props.py] : 0,
      }}
    >
      <span> {props.text}</span>
    </TextDividerEl>
  );
};

export const TextDividerEl = styled.div<{ theme?: Theme }>`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.secondaryText};
  font-size: ${fontSize.sm};
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid ${(p) => p.theme.colors.separatorLine};
  }

  span {
    margin: 0 1rem;
  }
`;
