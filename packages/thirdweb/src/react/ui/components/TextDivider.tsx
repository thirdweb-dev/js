import { useCustomTheme } from "../design-system/CustomThemeProvider.js";
import { StyledDiv } from "../design-system/elements.js";
import { spacing, fontSize } from "../design-system/index.js";

/**
 *
 * @internal
 */
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

export const TextDividerEl = /* @__PURE__ */ StyledDiv(() => {
  const theme = useCustomTheme();
  return {
    display: "flex",
    alignItems: "center",
    color: theme.colors.secondaryText,
    fontSize: fontSize.sm,
    "&::before, &::after": {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.colors.separatorLine}`,
    },
    span: {
      margin: "0 16px",
    },
  };
});
