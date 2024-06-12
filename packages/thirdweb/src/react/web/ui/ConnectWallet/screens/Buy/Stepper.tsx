import { keyframes } from "@emotion/react";
import { CheckIcon } from "@radix-ui/react-icons";
import { fontSize, iconSize } from "../../../../../core/design-system/index.js";
import { Container } from "../../../components/basic.js";
import { StyledDiv } from "../../../design-system/elements.js";

export function StepIcon(props: {
  isDone: boolean;
  isActive: boolean;
}) {
  return (
    <Container
      flex="row"
      center="both"
      color={
        props.isDone
          ? "success"
          : props.isActive
            ? "accentText"
            : "secondaryText"
      }
    >
      <Circle>
        {props.isDone ? (
          <CheckIcon width={iconSize.sm} height={iconSize.sm} />
        ) : (
          <PulsingDot data-active={props.isActive} />
        )}
      </Circle>
    </Container>
  );
}

export function Step(props: {
  isDone: boolean;
  label: string;
  isActive: boolean;
}) {
  return (
    <Container
      flex="row"
      center="y"
      gap="xs"
      style={{
        fontSize: fontSize.sm,
      }}
      color={
        props.isDone
          ? "success"
          : props.isActive
            ? "accentText"
            : "secondaryText"
      }
    >
      <StepIcon isDone={props.isDone} isActive={props.isActive} />
      {props.label}
    </Container>
  );
}

const pulseAnimation = keyframes`
0% {
  opacity: 1;
  transform: scale(0.5);
}
100% {
  opacity: 0;
  transform: scale(1.5);
}
`;

const PulsingDot = /* @__PURE__ */ StyledDiv(() => {
  return {
    background: "currentColor",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    '&[data-active="true"]': {
      animation: `${pulseAnimation} 1s infinite`,
    },
  };
});

const Circle = /* @__PURE__ */ StyledDiv(() => {
  return {
    border: "1px solid currentColor",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});
