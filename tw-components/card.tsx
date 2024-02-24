import { Box, BoxProps } from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { ComponentWithChildren } from "types/component-with-children";

type DefaultedBoxProps = Pick<
  BoxProps,
  "shadow" | "py" | "px" | "borderRadius" | "borderWidth" | "borderColor"
>;

const defaultBoxProps: Required<DefaultedBoxProps> = {
  shadow: "sm",
  px: 4,
  py: 4,
  borderRadius: "xl",
  borderWidth: "1px",
  borderColor: "borderColor",
};

const borderRadiusMap = {
  "3xl": "2xl",
  "2xl": "xl",
  xl: "lg",
  lg: "md",
  md: "sm",
  sm: "none",
  none: "none",
};

const CardStackContext = createContext(0);

export const CardElevationWrapper: ComponentWithChildren = ({ children }) => {
  const elevation = useContext(CardStackContext);
  return (
    <CardStackContext.Provider value={elevation + 1}>
      {children}
    </CardStackContext.Provider>
  );
};

export interface CardProps extends BoxProps {
  outlineBorder?: {
    gradient: string;
    width: string;
  };
}

function getBorderRadius(
  borderRadius: BoxProps["borderRadius"],
): BoxProps["borderRadius"] {
  try {
    return (borderRadiusMap as any)[borderRadius as any];
  } catch (e) {
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
          p={outlineBorder.width}
          borderRadius={combinedProps.borderRadius}
          position="relative"
          overflow="hidden"
          w={combinedProps.w || combinedProps.width}
        >
          <Box
            zIndex={-1}
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bgGradient={outlineBorder.gradient}
          />

          <Box
            {...combinedProps}
            w="full"
            borderRadius={getBorderRadius(combinedProps.borderRadius)}
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
