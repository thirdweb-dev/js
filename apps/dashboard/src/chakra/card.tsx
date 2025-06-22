import { Box, type BoxProps } from "@chakra-ui/react";

type DefaultedBoxProps = Pick<
  BoxProps,
  "shadow" | "py" | "px" | "borderRadius" | "borderWidth" | "borderColor"
>;

const defaultBoxProps: Required<DefaultedBoxProps> = {
  borderColor: "borderColor",
  borderRadius: "xl",
  borderWidth: "1px",
  px: 4,
  py: 4,
  shadow: "sm",
};

const borderRadiusMap = {
  "2xl": "xl",
  "3xl": "2xl",
  lg: "md",
  md: "sm",
  none: "none",
  sm: "none",
  xl: "lg",
};

interface CardProps extends BoxProps {
  outlineBorder?: {
    gradient: string;
    width: string;
  };
}

function getBorderRadius(
  borderRadius: BoxProps["borderRadius"],
): BoxProps["borderRadius"] {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    return (borderRadiusMap as any)[borderRadius as any];
  } catch {
    return borderRadius;
  }
}

export const Card: React.FC<CardProps> = ({
  children,
  outlineBorder,
  ...requiredBoxProps
}) => {
  const combinedProps = { ...{ ...defaultBoxProps, ...requiredBoxProps } };

  return (
    <>
      {outlineBorder ? (
        <Box
          borderRadius={combinedProps.borderRadius}
          overflow="hidden"
          p={outlineBorder.width}
          position="relative"
          w={combinedProps.w || combinedProps.width}
        >
          <Box
            bgGradient={outlineBorder.gradient}
            h="full"
            left={0}
            position="absolute"
            top={0}
            w="full"
            zIndex={-1}
          />

          <Box
            {...combinedProps}
            borderRadius={getBorderRadius(combinedProps.borderRadius)}
            w="full"
          >
            {children}
          </Box>
        </Box>
      ) : (
        <Box {...combinedProps}>{children}</Box>
      )}
    </>
  );
};
