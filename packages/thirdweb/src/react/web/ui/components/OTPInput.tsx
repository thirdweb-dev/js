"use client";
import { keyframes } from "@emotion/react";
import { OTPInput as InputOTP, type SlotProps } from "input-otp";
import { useCustomTheme } from "../../../core/design-system/CustomThemeProvider.js";
import {
  fontSize,
  radius,
  spacing,
} from "../../../core/design-system/index.js";
import { StyledDiv } from "../design-system/elements.js";
import { Container } from "./basic.js";

/**
 * @internal
 */
export function OTPInput(props: {
  digits: number;
  isInvalid?: boolean;
  value: string;
  setValue: (value: string) => void;
  onEnter: () => void;
}) {
  return (
    <OTPInputContainer>
      <InputOTP
        onComplete={() => {
          props.onEnter();
        }}
        maxLength={6}
        value={props.value}
        render={({ slots }) => (
          <Container flex="row" gap="xs" center="both">
            {slots.map((slot, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: index is the only valid key here
              <Slot key={idx} {...slot} isInvalid={props.isInvalid} />
            ))}
          </Container>
        )}
        onChange={(newValue) => {
          props.setValue(newValue);
        }}
      />
    </OTPInputContainer>
  );
}

const OTPInputContainer = /* @__PURE__ */ StyledDiv({
  "& input": {
    maxWidth: "100%",
  },
});

function Slot(props: SlotProps & { isInvalid?: boolean }) {
  return (
    <OTPInputBox data-active={props.isActive} data-error={props.isInvalid}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </OTPInputBox>
  );
}

const caretBlink = keyframes`
  0%, 100% {
    opacity: 0;
  },
  50% {
    opacity: 1;
  }
  `;

const FakeCaret = StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    position: "absolute",
    pointerEvents: "none",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: `${caretBlink} 1s infinite`,
    "&::before": {
      content: "''",
      display: "block",
      width: "1.5px",
      height: "1em",
      backgroundColor: theme.colors.primaryText,
    },
  };
});

const OTPInputBox = /* @__PURE__ */ StyledDiv((_) => {
  const theme = useCustomTheme();
  return {
    position: "relative",
    width: "40px",
    height: "40px",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: fontSize.md,
    padding: spacing.xs,
    boxSizing: "border-box",
    transition: "color 200ms ease",
    border: `2px solid ${theme.colors.borderColor}`,
    "&[data-active='true']": {
      borderColor: theme.colors.accentText,
    },
    color: theme.colors.primaryText,
    borderRadius: radius.lg,
    "&[data-error='true']": {
      borderColor: theme.colors.danger,
    },
  };
});
