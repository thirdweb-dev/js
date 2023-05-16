import { Theme, fontSize, media } from "../design-system";
import { iconSize } from "../design-system";
import { IconButton } from "./buttons";
import styled from "@emotion/styled";
import { Title } from "@radix-ui/react-dialog";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export const ModalTitle = styled(Title)<{
  theme?: Theme;
  centerOnMobile?: boolean;
}>`
  margin: 0;
  font-weight: 600;
  font-size: ${fontSize.lg};
  color: ${(p) => p.theme.text.neutral};
  text-align: left;
  ${media.mobile} {
    text-align: ${(p) => (p.centerOnMobile ? "center" : "left")};
  }
`;

export const ModalDescription = styled.p<{
  theme?: Theme;
  centerOnMobile?: boolean;
  sm?: boolean;
}>`
  all: unset;
  display: block;
  font-size: ${(p) => (p.sm ? fontSize.sm : fontSize.md)};
  color: ${(p) => p.theme.text.secondary};
  line-height: 1.5;
  ${media.mobile} {
    text-align: ${(p) => (p.centerOnMobile ? "center" : "left")};
  }
`;

export const BackButton: React.FC<{
  onClick: () => void;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <IconButton
      variant="secondary"
      onClick={props.onClick}
      style={props.style}
      type="button"
    >
      <ChevronLeftIcon
        style={{
          width: iconSize.md,
          height: iconSize.md,
        }}
      />
    </IconButton>
  );
};

export const HelperLink = styled.a<{ theme?: Theme; md?: boolean }>`
  all: unset;
  cursor: pointer;
  color: ${(p) => p.theme.link.primary};
  font-size: ${(p) => (p.md ? fontSize.md : fontSize.sm)};
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
