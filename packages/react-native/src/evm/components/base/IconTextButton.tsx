import { ReactNode } from "react";
import { Theme } from "../../styles/theme";
import BaseButton from "./BaseButton";
import Text from "./Text";
import { StyleSheet } from "react-native";

type IconTextProps = {
  icon?: ReactNode;
  text: string;
  padding?: keyof Theme["spacing"];
  onPress: () => void;
} & React.ComponentProps<typeof BaseButton>;

/**
 * @internal
 */
export const IconTextButton = ({
  icon,
  onPress,
  text,
  p,
  ...args
}: IconTextProps) => {
  return (
    <BaseButton
      p={p || "sm"}
      backgroundColor="background"
      borderRadius="md"
      borderWidth={0.5}
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      onPress={onPress}
      borderColor="border"
      {...args}
    >
      {icon}
      <Text variant="bodySmall" style={styles.networkText}>
        {text}
      </Text>
      {/* <RightArrowIcon size={10} /> */}
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  networkText: {
    marginLeft: 8,
  },
});
