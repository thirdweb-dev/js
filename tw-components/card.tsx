import { Box, BoxProps } from "@chakra-ui/layout";
import { createContext, useContext } from "react";

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

const CardStackContext = createContext(0);

const cardStackBgMap: Record<number, string> = {
  0: "backgroundHighlight",
  1: "backgroundCardHighlight",
  2: "backgroundHighlight",
  3: "backgroundCardHighlight",
};

export interface CardProps extends BoxProps {}
export const Card: React.FC<CardProps> = ({
  children,
  ...requiredBoxProps
}) => {
  const cardStackLevel = useContext(CardStackContext);

  return (
    <CardStackContext.Provider value={cardStackLevel + 1}>
      <Box
        backgroundColor={
          cardStackBgMap[cardStackLevel] || "backgroundHighlight"
        }
        {...{ ...defaultBoxProps, ...requiredBoxProps }}
      >
        {children}
      </Box>
    </CardStackContext.Provider>
  );
};
