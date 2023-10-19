import Box from "./Box";
import Text from "./Text";
import { StyleSheet } from "react-native";

type LabelProps = {
  text: string;
} & React.ComponentProps<typeof Text>;

export const Label = ({ text, ...props }: LabelProps) => {
  return (
    <Box
      justifyContent="center"
      flexDirection="row"
      alignItems="center"
      borderRadius="md"
      backgroundColor="labelBackground"
    >
      <Text variant="bodySmall" style={style.text} {...props}>
        {text}
      </Text>
    </Box>
  );
};

const style = StyleSheet.create({
  text: {
    textAlign: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
});
