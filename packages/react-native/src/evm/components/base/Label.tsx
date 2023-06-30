import { useAppTheme } from "../../styles/hooks";
import Text from "./Text";
import { StyleSheet } from "react-native";

type LabelProps = {
  text: string;
} & (typeof Text)["arguments"];

export const Label = ({ text, ...props }: LabelProps) => {
  const theme = useAppTheme();
  return (
    // <Box
    //   justifyContent="center"
    //   flexDirection="row"
    //   alignItems="center"
    //   paddingVertical="xxs"
    //   paddingHorizontal="xs"
    //   borderRadius="lg"
    //   backgroundColor="labelBackground"
    // >
    <Text
      variant="bodySmall"
      style={{
        ...style.text,
        backgroundColor: theme.colors.labelBackground,
        ...props,
      }}
    >
      {text}
    </Text>
  );
};

const style = StyleSheet.create({
  text: {
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderRadius: 8,
  },
});
