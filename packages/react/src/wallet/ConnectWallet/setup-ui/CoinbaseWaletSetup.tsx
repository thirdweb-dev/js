import { Spacer } from "../../../components/Spacer";
import { Spinner } from "../../../components/Spinner";
import { iconSize, spacing } from "../../../design-system";
import { CoinbaseWalletIcon } from "../icons/CoinbaseWalletIcon";
import {
  BackButton,
  HelperLink,
  ModalDescription,
  ModalTitle,
} from "../shared/modalElements";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";

export const CoinbaseWalletSetup: React.FC<{ onBack: () => void }> = (
  props,
) => {
  return (
    <>
      <BackButton onClick={props.onBack} />
      <Spacer y="lg" />
      <CoinbaseWalletIcon width={iconSize.xl} height={iconSize.xl} />
      <Spacer y="md" />
      <TitleContainer>
        <ModalTitle>Connecting your wallet</ModalTitle>
        <Spinner size="md" color={blue.blue10} />
      </TitleContainer>
      <Spacer y="md" />
      <ModalDescription>
        Login and connect your wallet through the metamask pop-up
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
