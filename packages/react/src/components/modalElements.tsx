import { type Theme, fontSize, media } from "../design-system";
import { iconSize } from "../design-system";
import { IconButton } from "./buttons";
import styled from "@emotion/styled";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export const ModalTitle = /* @__PURE__ */ styled.h2<{
  theme?: Theme;
  centerOnMobile?: boolean;
}>`
  margin: 0;
  font-weight: 500;
  font-size: ${fontSize.lg};
  color: ${(p) => p.theme.colors.primaryText};
  line-height: 1.3;
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
  color: ${(p) => p.theme.colors.secondaryText};
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
      style={{ transform: "translateX(-25%)", ...props.style }}
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
  color: ${(p) => p.theme.colors.accentText};
  font-size: ${(p) => (p.md ? fontSize.md : fontSize.sm)};
  text-decoration: none;
  display: block;
  line-height: 1.5;
  ${media.mobile} {
    text-align: center;
  }
  &:hover {
    color: ${(p) => p.theme.colors.primaryText};
    text-decoration: none;
  }
`;
