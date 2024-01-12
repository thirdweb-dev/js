import { fontSize, spacing } from "../design-system";
import { StyledDiv } from "../design-system/elements";
import { useCustomTheme } from "../design-system/CustomThemeProvider";

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

const TextDividerEl = /* @__PURE__ */ StyledDiv(() => {
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
