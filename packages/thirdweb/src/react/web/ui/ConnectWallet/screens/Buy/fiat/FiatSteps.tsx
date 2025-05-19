import { Cross1Icon } from "@radix-ui/react-icons";
import {
  type Theme,
  iconSize,
  radius,
  spacing,
} from "../../../../../../core/design-system/index.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Container } from "../../../../components/basic.js";
import { Text } from "../../../../components/text.js";
import { StepIcon } from "../Stepper.js";
import type { FiatStatusMeta } from "../pay-transactions/statusMeta.js";

export type BuyWithFiatPartialQuote = {
  fromCurrencySymbol: string;
  fromCurrencyAmount: string;
  onRampTokenAmount: string;
  toTokenAmount: string;
  onRampToken: {
    tokenAddress: string;
    name?: string;
    symbol?: string;
    chainId: number;
  };

  toToken: {
    tokenAddress: string;
    name?: string;
    symbol?: string;
    chainId: number;
  };
};

export function StepContainer(props: {
  state?: FiatStatusMeta["progressStatus"];
  children: React.ReactNode;
  style?: React.CSSProperties;
  index?: number;
}) {
  let color: keyof Theme["colors"] = "borderColor";
  let text: string | undefined;

  if (props.state === "pending") {
    text = "Pending";
    color = "accentText";
  } else if (props.state === "actionRequired") {
    color = "accentText";
  } else if (props.state === "completed") {
    text = "Completed";
    color = "success";
  } else if (props.state === "failed") {
    color = "danger";
    text = "Failed";
  }

  return (
    <Container
      bg="tertiaryBg"
      borderColor={color === "success" ? "borderColor" : color}
      py="sm"
      px="md"
      style={{
        borderRadius: radius.lg,
        alignItems: "flex-start",
        borderWidth: "1px",
        borderStyle: "solid",
        position: "relative",
        ...props.style,
      }}
    >
      {props.children}
      <div
        style={{
          position: "absolute",
          right: spacing.xs,
          top: spacing.xs,
          display: "flex",
          gap: spacing.xs,
          alignItems: "center",
        }}
      >
        {props.state && text && (
          <Text size="xs" color={color}>
            {text}
          </Text>
        )}

        {(props.state === "actionRequired" || props.state === "completed") && (
          <StepIcon
            isActive={props.state === "actionRequired"}
            isDone={props.state === "completed"}
          />
        )}

        {props.state === "pending" && <Spinner color="accentText" size="sm" />}

        {props.state === "failed" && (
          <Container color="danger" flex="row" center="both">
            <Cross1Icon width={iconSize.sm} height={iconSize.sm} />
          </Container>
        )}
      </div>
    </Container>
  );
}
