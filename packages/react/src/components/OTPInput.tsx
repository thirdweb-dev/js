import { useEffect, useRef } from "react";
import { Input } from "./formElements";
import { Container } from "./basic";
import { media, fontSize, spacing } from "../design-system";
import styled from "@emotion/styled";
import { useCustomTheme } from "../design-system/CustomThemeProvider";

export function OTPInput(props: {
  digits: number;
  isInvalid?: boolean;
  value: string;
  setValue: (value: string) => void;
  onEnter?: () => void;
}) {
  const otp = props.value.split("");

  const setOTP = (newOTP: string[]) => {
    props.setValue(newOTP.join(""));
  };

  const inputToFocusIndex = otp.length;
  const boxEls = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (boxEls.current[inputToFocusIndex]) {
      requestAnimationFrame(() => {
        boxEls.current[inputToFocusIndex]?.focus();
      });
    }
  }, [inputToFocusIndex]);

  return (
    <Container center="x" gap="sm" flex="row">
      {new Array(props.digits).fill(null).map((_, i) => {
        return (
          <OTPInputBox
            data-error={props.isInvalid}
            ref={(e) => (boxEls.current[i] = e)}
            key={i}
            value={otp[i] ?? ""}
            type="text"
            pattern="[a-zA-Z0-9]*"
            variant="outline"
            inputMode="text"
            onPaste={(e) => {
              const pastedData = e.clipboardData.getData("text/plain");
              const newOTP = pastedData.slice(0, props.digits).split("");
              setOTP(newOTP);
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (props.onEnter) {
                  props.onEnter();
                  return;
                }
              }

              if (e.key === "ArrowLeft") {
                if (i === 0) {
                  return;
                }

                boxEls.current[i - 1]?.focus();
                return;
              }

              if (e.key === "ArrowRight") {
                if (i === props.digits - 1) {
                  return;
                }

                boxEls.current[i + 1]?.focus();
                return;
              }

              if (e.key === "e" || e.key === ".") {
                e.preventDefault();
                return;
              }

              if (e.key === "Backspace") {
                if (i === 0) {
                  return;
                }

                const newOTP = otp.slice(0, -1);
                setOTP(newOTP);
              }
            }}
            onChange={(e) => {
              let value = e.target.value;

              if (value.length > 1) {
                const lastValue = value[value.length - 1];
                if (lastValue) {
                  value = lastValue;
                }
              }

              if (!/\d/.test(value) && value !== "") {
                e.preventDefault();
                return;
              }

              const newOTP = [...otp];
              const index = i > inputToFocusIndex - 1 ? inputToFocusIndex : i;

              newOTP[index] = value;
              setOTP(newOTP);
            }}
          />
        );
      })}
    </Container>
  );
}

const OTPInputBox = /* @__PURE__ */ styled(Input)(() => {
  const theme = useCustomTheme();
  return {
    appearance: "none",
    WebkitAppearance: "none",
    width: "40px",
    height: "40px",
    textAlign: "center",
    fontSize: fontSize.md,
    padding: spacing.xs,
    [media.mobile]: {
      width: "35px",
      height: "35px",
    },
    "&[data-verify-status='invalid']": {
      color: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
  };
});
