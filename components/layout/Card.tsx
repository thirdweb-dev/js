import { Box, BoxProps } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/system";

type DefaultedBoxProps = Pick<
  BoxProps,
  | "shadow"
  | "backgroundColor"
  | "py"
  | "px"
  | "borderRadius"
  | "borderWidth"
  | "borderColor"
>;

const defaultBoxProps: Required<DefaultedBoxProps> = {
  shadow: "sm",
  backgroundColor: "backgroundHighlight",
  px: 4,
  py: 4,
  borderRadius: "xl",
  borderWidth: "1px",
  borderColor: "gray.200",
};

export interface CardProps extends BoxProps {}
export const Card: React.FC<CardProps> = ({
  children,
  ...requiredBoxProps
}) => {
  const light = {
    ...defaultBoxProps,
    borderWidth: "1px",
    borderColor: "gray.200",
  };
  const dark = {
    ...defaultBoxProps,
    borderWidth: "1px",
    borderColor: "whiteAlpha.100",
  };
  const defaultProps = useColorModeValue(light, dark);
  return <Box {...{ ...defaultProps, ...requiredBoxProps }}>{children}</Box>;
};
