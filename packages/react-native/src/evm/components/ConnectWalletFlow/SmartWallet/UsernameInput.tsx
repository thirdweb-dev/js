import { TextInput } from "react-native";
import Text from "../../base/Text";
import { useLocale } from "../../../providers/ui-context-provider";

export const UsernameInput = ({
  onChangeText,
}: {
  onChangeText: TextInput["props"]["onChangeText"];
}) => {
  const l = useLocale();
  return (
    <>
      <Text variant="bodySmall" textAlign="left" mt="lg" mb="xxs">
        {l.common.username}
      </Text>
      <TextInput onChangeText={onChangeText} />
    </>
  );
};
