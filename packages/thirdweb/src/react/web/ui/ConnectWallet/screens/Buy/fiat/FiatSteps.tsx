import { Cross1Icon } from "@radix-ui/react-icons";
import {
  iconSize,
  radius,
  spacing,
  type Theme,
} from "../../../../../../core/design-system/index.js";
import { Container } from "../../../../components/basic.js";
import { Spinner } from "../../../../components/Spinner.js";
import { Text } from "../../../../components/text.js";
import type { FiatStatusMeta } from "../pay-transactions/statusMeta.js";
import { StepIcon } from "../Stepper.js";

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
      px="md"
      py="sm"
      style={{
        alignItems: "flex-start",
        borderRadius: radius.lg,
        borderStyle: "solid",
        borderWidth: "1px",
        position: "relative",
        ...props.style,
      }}
    >
      {props.children}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: spacing.xs,
          position: "absolute",
          right: spacing.xs,
          top: spacing.xs,
        }}
      >
        {props.state && text && (
          <Text color={color} size="xs">
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
          <Container center="both" color="danger" flex="row">
            <Cross1Icon height={iconSize.sm} width={iconSize.sm} />
          </Container>
        )}
      </div>
    </Container>
  );
}
