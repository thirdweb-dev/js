import { View } from "react-native";
import BaseButton from "./BaseButton";
import ImageSvgUri from "./ImageSvgUri";
import { Label } from "./Label";
import Text from "./Text";
import Box from "./Box";

type WalletButtonProps = {
  onPress: () => void;
  walletIconUrl: string;
  name: string;
  labelText?: string;
} & React.ComponentProps<typeof BaseButton>;

export const WalletButton = ({
  mb,
  onPress,
  walletIconUrl,
  name,
  labelText,
}: WalletButtonProps) => {
  return (
    <BaseButton
      mb={mb}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="md"
      paddingVertical="sm"
      borderRadius="sm"
      backgroundColor="backgroundHighlight"
      onPress={onPress}
    >
      <Box flexDirection="row" justifyContent="flex-start" alignItems="center">
        <ImageSvgUri imageUrl={walletIconUrl} width={32} height={32} />
        <Text ml="md" variant="bodyLarge">
          {name}
        </Text>
      </Box>
      {labelText ? <Label text={labelText} /> : <View />}
    </BaseButton>
  );
};
