"use client";
import { CustomThemeProvider } from "../../../core/design-system/CustomThemeProvider.js";
import type { Theme } from "../../../core/design-system/index.js";
import { spacing } from "../../../core/design-system/index.js";
import {
  Container,
  ModalHeader,
  ScreenBottomContainer,
} from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Modal } from "../components/Modal.js";
import { Text } from "../components/text.js";

type SignInRequiredModalProps = {
  theme: Theme | "light" | "dark";
  onSignIn: () => void;
  onCancel: () => void;
};

/**
 * @internal
 */
export function SignInRequiredModal(props: SignInRequiredModalProps) {
  const { theme, onSignIn, onCancel } = props;

  return (
    <CustomThemeProvider theme={theme}>
      <Modal
        className="tw-signin-required-modal"
        hideCloseIcon={true}
        open={true}
        setOpen={(open) => {
          if (!open) {
            onCancel();
          }
        }}
        size="compact"
        title="Sign in required"
      >
        <Container p="lg">
          <ModalHeader title="Sign in required" />

          <Container
            flex="column"
            gap="lg"
            style={{
              paddingTop: spacing.lg,
            }}
          >
            {/* Description */}
            <Text
              size="sm"
              style={{
                color: "inherit",
                lineHeight: 1.5,
              }}
            >
              Account required to complete payment, please sign in to continue.
            </Text>
          </Container>
        </Container>

        {/* Action Buttons */}
        <ScreenBottomContainer>
          <Button fullWidth gap="xs" onClick={onSignIn} variant="accent">
            Sign in
          </Button>
          <Button fullWidth gap="xs" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </ScreenBottomContainer>
      </Modal>
    </CustomThemeProvider>
  );
}
