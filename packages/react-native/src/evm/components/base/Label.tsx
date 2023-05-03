import Box from "./Box";
import Text from "./Text";

type LabelProps = {
  text: string;
};
export const Label = ({ text }: LabelProps) => {
  return (
    <Box
      justifyContent="center"
      flexDirection="row"
      alignItems="center"
      paddingVertical="xxs"
      paddingHorizontal="xs"
      borderRadius="lg"
      backgroundColor="labelBackground"
    >
      <Text variant="bodyLarge">{text}</Text>
    </Box>
  );
};
