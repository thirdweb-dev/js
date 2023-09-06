import styled from "@emotion/styled";
import { flyingAnimation } from "../../../components/animations";
import { spacing } from "../../../design-system";
import { PaperIcon } from "../../ConnectWallet/icons/PaperIcon";

export function FloatingPlane(props: { size: number }) {
  return (
    <PlaneIconContainer
      style={
        {
          "--shadow-size": props.size / 12 + "px",
        } as React.CSSProperties
      }
    >
      <PaperIcon size={String(props.size)} />
    </PlaneIconContainer>
  );
}

const PlaneIconContainer = styled.div`
  padding: ${spacing.xl};
  display: flex;
  justify-content: center;
  filter: drop-shadow(0 0 var(--shadow-size) hsl(195.93deg 83.7% 73.53% / 35%));
  animation: ${flyingAnimation} 2s ease infinite alternate;
`;
