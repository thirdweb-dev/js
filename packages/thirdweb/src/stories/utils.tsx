import { createThirdwebClient } from "../client/client.js";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "../react/core/design-system/CustomThemeProvider.js";
import type { Theme } from "../react/core/design-system/index.js";
import { radius } from "../react/native/design-system/index.js";

const clientId = process.env.STORYBOOK_CLIENT_ID;

if (!clientId) {
  throw new Error("STORYBOOK_CLIENT_ID env is not configured");
}

export const storyClient = createThirdwebClient({
  clientId: clientId,
});

export const ModalThemeWrapper = (props: {
  children: React.ReactNode;
  theme: "light" | "dark" | Theme;
}) => {
  const { theme } = props;
  return (
    <CustomThemeProvider theme={theme}>
      <ModalWrapper>{props.children}</ModalWrapper>
    </CustomThemeProvider>
  );
};

const ModalWrapper = (props: { children: React.ReactNode }) => {
  const theme = useCustomTheme();
  return (
    <div
      style={{
        backgroundColor: theme.colors.modalBg,
        borderRadius: radius.md,
        boxShadow: `0 0 0 1px ${theme.colors.borderColor}`,
        margin: "16px auto",
        width: 400,
      }}
    >
      {props.children}
    </div>
  );
};
