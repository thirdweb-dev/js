import { Spacer } from "../../../../components/Spacer";
import { Spinner } from "../../../../components/Spinner";
import { IconButton } from "../../../../components/buttons";
import { fontSize, iconSize, spacing, Theme } from "../../../../design-system";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { blue } from "@radix-ui/colors";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export const NoticeShell: React.FC<{
  loading?: boolean;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  onBack: () => void;
  helper?: {
    text: string;
    link: string;
  };
  children?: React.ReactNode;
}> = (props) => {
  return (
    <FadeIn>
      <div>
        <IconButton variant="secondary" onClick={props.onBack}>
          <ChevronLeftIcon
            style={{
              width: iconSize.md,
              height: iconSize.md,
            }}
          />
        </IconButton>
      </div>

      <Spacer y="md" />

      {props.icon}

      <TitleContainer>
        <Dialog.Title asChild>
          <DialogTitle> {props.title} </DialogTitle>
        </Dialog.Title>
        {props.loading && <Spinner size="md" color={blue.blue10} />}
      </TitleContainer>

      <DialogDescriptionLarge>{props.description}</DialogDescriptionLarge>

      {props.description ? <Spacer y="xl" /> : <Spacer y="md" />}

      {props.helper && (
        <HelperLink href={props.helper.link}>{props.helper.text}</HelperLink>
      )}

      {props.children}
    </FadeIn>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 0.15s ease-in;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-weight: 500;
  font-size: ${fontSize.md};
`;

const HelperLink = styled.a<{ theme?: Theme }>`
  color: ${(p) => p.theme.link.primary};
  font-size: ${fontSize.sm};
  text-decoration: none;
`;

const DialogDescriptionLarge = styled.p<{ theme?: Theme }>`
  all: unset;
  display: block;
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
  line-height: 1.5;
`;

const DialogTitle = styled.h2<{ theme?: Theme }>`
  font-size: ${fontSize.lg};
  font-weight: 500;
  color: ${(p) => p.theme.text.neutral};
`;
