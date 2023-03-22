import styled from "@emotion/styled";
import { media, spacing, Theme } from "../../../../design-system";

export function Steps({ step }: { step: 1 | 2 }) {
  return (
    <StepContainer>
      <Circle data-active />
      <Line data-active={step === 2} />
      <Circle data-active={step === 2} />
    </StepContainer>
  );
}

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  width: 150px;
  padding: ${spacing.xs};

  ${media.mobile} {
    margin: 0 auto;
  }
`;

const Circle = styled.div<{ theme?: Theme }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(p) => p.theme.bg.highlighted};
  /* 3 borders using box-shadow */
  box-shadow: 0 0 0 2px ${(p) => p.theme.bg.highlighted},
    0 0 0 5px ${(p) => p.theme.bg.base},
    0 0 0 7px ${(p) => p.theme.bg.highlighted};

  &[data-active="true"] {
    background-color: ${(p) => p.theme.link.primary};
    box-shadow: 0 0 0 2px ${(p) => p.theme.link.primary},
      0 0 0 5px ${(p) => p.theme.bg.base},
      0 0 0 7px ${(p) => p.theme.link.primary};
    position: relative;
    z-index: 2;
  }
`;

const Line = styled.div<{ theme?: Theme }>`
  flex-grow: 1;
  height: 4px;
  background-color: ${(p) => p.theme.bg.highlighted};
  &[data-active="true"] {
    background-color: ${(p) => p.theme.link.primary};
  }
`;
