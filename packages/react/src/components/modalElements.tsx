import { Theme, fontSize, media } from "../design-system";
import { iconSize } from "../design-system";
import { IconButton } from "./buttons";
import styled from "@emotion/styled";
import { Title } from "@radix-ui/react-dialog";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export const ModalTitle = styled(Title)<{ theme?: Theme }>`
  margin: 0;
  font-weight: 600;
  font-size: ${fontSize.lg};
  color: ${(p) => p.theme.text.neutral};
  ${media.mobile} {
    text-align: center;
  }
`;

export const ModalDescription = styled.p<{ theme?: Theme }>`
  all: unset;
  display: block;
  font-size: ${fontSize.md};
  color: ${(p) => p.theme.text.secondary};
  line-height: 1.5;
  ${media.mobile} {
    text-align: center;
  }
`;

export const BackButton: React.FC<{
  onClick: () => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <IconButton variant="secondary" onClick={props.onClick} style={props.style}>
      <ChevronLeftIcon
        style={{
          width: iconSize.md,
          height: iconSize.md,
        }}
      />
    </IconButton>
  );
};

export const HelperLink = styled.a<{ theme?: Theme }>`
  all: unset;
  cursor: pointer;
  color: ${(p) => p.theme.link.primary};
  font-size: ${fontSize.sm};
  text-decoration: none;
  display: block;
  ${media.mobile} {
    text-align: center;
  }
  &:hover {
    color: ${(p) => p.theme.link.primaryHover};
    text-decoration: none;
  }
`;
