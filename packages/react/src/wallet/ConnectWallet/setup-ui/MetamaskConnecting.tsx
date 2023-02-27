import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { iconSize, spacing } from "../../../design-system";
import { MetamaskIcon } from "../icons/MetamaskIcon";
import {
  BackButton,
  ModalTitle,
  ModalDescription,
  HelperLink,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";

export const MetamaskConnecting: React.FC<{ onBack: () => void }> = (props) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <MetamaskIcon width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="md" />
      <TitleContainer>
        <ModalTitle>Connecting your wallet</ModalTitle>
        <Spinner size="md" color={blue.blue10} />
      </TitleContainer>
      <Spacer y="md" />
      <ModalDescription>
        Login and connect your wallet through the <br />
        Metamask pop-up
      </ModalDescription>
      <Spacer y="md" />
      <HelperLink href="/foo/bar" target="_blank">
        Having troubles connecting to metamask?
      </HelperLink>
    </>
  );
};

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;
