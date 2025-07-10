"use client";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { trackPayEvent } from "../../../../analytics/track/pay.js";
import type { ThirdwebClient } from "../../../../client/client.js";
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
  client: ThirdwebClient;
}

export function ErrorBanner({
  error,
  onRetry,
  onCancel,
  client,
}: ErrorBannerProps) {
  const theme = useCustomTheme();

  const { userMessage } = useBridgeError({ error });

  useQuery({
    queryFn: () => {
      trackPayEvent({
        client,
        error: error.message,
        event: "ub:ui:error",
      });
      return true;
    },
    queryKey: ["error_banner", userMessage],
  });

  return (
    <Container flex="column" fullHeight gap="md" p="lg">
      {/* Error Icon and Message */}
      <Container flex="row" gap="md" style={{ alignItems: "flex-start" }}>
        <Container
          center="both"
          style={{
            backgroundColor: theme.colors.tertiaryBg,
            borderRadius: "50%",
            flexShrink: 0,
            height: "24px",
            width: "24px",
          }}
        >
          <CrossCircledIcon
            color={theme.colors.danger}
            height={iconSize.md}
            width={iconSize.md}
          />
        </Container>

        <Container flex="column" fullHeight gap="sm" style={{ flex: 1 }}>
          <Text color="primaryText" size="lg">
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
              <Text color="secondaryText" size="sm">
                {userMessage}
              </Text>
            </Container>
          </Container>

          {/* Action Buttons */}
          <Container flex="row" gap="sm" style={{ justifyContent: "flex-end" }}>
            <Button onClick={onRetry} variant="primary">
              Try Again
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="secondary">
                Cancel
              </Button>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
