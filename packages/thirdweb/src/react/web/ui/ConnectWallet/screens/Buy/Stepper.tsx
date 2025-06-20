import { keyframes } from "@emotion/react";
import { CheckIcon } from "@radix-ui/react-icons";
import { fontSize, iconSize } from "../../../../../core/design-system/index.js";
import { Container } from "../../../components/basic.js";
import { StyledDiv } from "../../../design-system/elements.js";

export function StepIcon(props: { isDone: boolean; isActive: boolean }) {
  return (
    <Container
      center="both"
      color={
        props.isDone
          ? "success"
          : props.isActive
            ? "accentText"
            : "secondaryText"
      }
      flex="row"
    >
      <Circle>
        {props.isDone ? (
          <CheckIcon height={iconSize.sm} width={iconSize.sm} />
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
      center="y"
      color={
        props.isDone
          ? "success"
          : props.isActive
            ? "accentText"
            : "secondaryText"
      }
      flex="row"
      gap="xs"
      style={{
        fontSize: fontSize.sm,
      }}
    >
      <StepIcon isActive={props.isActive} isDone={props.isDone} />
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
    '&[data-active="true"]': {
      animation: `${pulseAnimation} 1s infinite`,
    },
    background: "currentColor",
    borderRadius: "50%",
    height: "10px",
    width: "10px",
  };
});

const Circle = /* @__PURE__ */ StyledDiv(() => {
  return {
    alignItems: "center",
    border: "1px solid currentColor",
    borderRadius: "50%",
    display: "flex",
    height: "20px",
    justifyContent: "center",
    width: "20px",
  };
});
