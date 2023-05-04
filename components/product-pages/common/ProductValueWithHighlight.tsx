import { HighlightedButton } from "./HighlightedButton";
import { Text } from "tw-components";

interface ProductValueWithHighlightProps {
  circleLabel: string;
  children: React.ReactNode;
}

export const ProductValueWithHighlight: React.FC<
  ProductValueWithHighlightProps
> = ({ circleLabel = "1", children }) => {
  return (
    <>
      <HighlightedButton
        title={circleLabel}
        fontWeight="bold"
        fullCircle
        isHighlighted
      />
      <Text mt={6} fontSize="lg" fontWeight="semi-bold" color="white">
        {children}
      </Text>
    </>
  );
};
