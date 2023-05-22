import { TextInput } from "react-native";
import Text from "../../base/Text";

export const UsernameInput = ({
  onChangeText,
}: {
  onChangeText: TextInput["props"]["onChangeText"];
}) => {
  return (
    <>
      <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
        Username
      </Text>
      <TextInput onChangeText={onChangeText} />
    </>
  );
};
