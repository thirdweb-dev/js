import { StyleSheet, TextInput } from "react-native";
import Box from "../../base/Box";
import Text from "../../base/Text";
import { useAppTheme } from "../../../styles/hooks";

export const UsernameInput = ({
  onChangeText,
}: {
  onChangeText: TextInput["props"]["onChangeText"];
}) => {
  const theme = useAppTheme();

  return (
    <>
      <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
        Username
      </Text>
      <Box
        flexDirection="row"
        alignItems="center"
        borderColor="border"
        borderWidth={1}
        borderRadius="md"
        pr="xs"
      >
        <TextInput
          style={{ ...styles.textInput, color: theme.colors.textPrimary }}
          returnKeyType={"done"}
          clearTextOnFocus={false}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
        />
      </Box>
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    textAlign: "left",
    flex: 1,
    height: 40,
    paddingLeft: 5,
  },
});
