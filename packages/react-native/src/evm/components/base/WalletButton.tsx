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
  recommended?: boolean;
} & React.ComponentProps<typeof BaseButton>;

export const WalletButton = ({
  mb,
  onPress,
  walletIconUrl,
  name,
  labelText,
  recommended,
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
      backgroundColor="background"
      onPress={onPress}
    >
      <Box flexDirection="row" justifyContent="flex-start" alignItems="center">
        <ImageSvgUri imageUrl={walletIconUrl} width={48} height={48} />
        <Box ml="sm">
          <Text variant="bodyLarge">{name}</Text>
          {recommended ? (
            <Text variant="bodySmallSecondary">Recommended</Text>
          ) : null}
        </Box>
      </Box>
      {labelText ? <Label text={labelText} /> : <View />}
    </BaseButton>
  );
};
