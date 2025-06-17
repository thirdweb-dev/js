"use client";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import { iconSize } from "../../../core/design-system/index.js";
import { useBridgeError } from "../../../core/hooks/useBridgeError.js";
import { Container } from "../components/basic.js";
import { Button } from "../components/buttons.js";
import { Text } from "../components/text.js";

interface ErrorBannerProps {
  /**
   * The error to display
   */
  error: Error;

  /**
   * Called when user wants to retry
   */
  onRetry: () => void;

  /**
   * Called when user wants to cancel
   */
  onCancel?: () => void;
}

export function ErrorBanner({ error, onRetry, onCancel }: ErrorBannerProps) {
  const theme = useCustomTheme();

  const { userMessage } = useBridgeError({ error });

  return (
    <Container flex="column" gap="md" p="lg" fullHeight>
      {/* Error Icon and Message */}
      <Container flex="row" gap="md" style={{ alignItems: "flex-start" }}>
        <Container
          center="both"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: theme.colors.tertiaryBg,
            flexShrink: 0,
          }}
        >
          <CrossCircledIcon
            width={iconSize.md}
            height={iconSize.md}
            color={theme.colors.danger}
          />
        </Container>

        <Container flex="column" gap="sm" style={{ flex: 1 }} fullHeight>
          <Text size="lg" color="primaryText">
            Error
          </Text>
          <Container
            flex="column"
            gap="sm"
            style={{
              minHeight: "100px",
            }}
          >
            <Container flex="column" gap="sm" style={{ flex: 1 }}>
              <Text size="sm" color="secondaryText">
                {userMessage}
              </Text>
            </Container>
          </Container>

          {/* Action Buttons */}
          <Container flex="row" gap="sm" style={{ justifyContent: "flex-end" }}>
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
