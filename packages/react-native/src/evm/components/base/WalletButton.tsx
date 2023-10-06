import { View } from "react-native";
import BaseButton from "./BaseButton";
import ImageSvgUri from "./ImageSvgUri";
import { Label } from "./Label";
import Text from "./Text";
import Box from "./Box";

type WalletButtonProps = {
  onPress?: () => void;
  walletIconUrl: string;
  name: string;
  labelText?: string;
  recommended?: boolean;
  iconWidth?: number;
  iconHeight?: number;
} & React.ComponentProps<typeof BaseButton>;

export const WalletButton = ({
  iconWidth = 48,
  iconHeight = 48,
  mb,
  onPress,
  walletIconUrl,
  name,
  labelText,
  recommended,
  ...props
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
      {...props}
    >
      <Box flexDirection="row" justifyContent="flex-start" alignItems="center">
        <ImageSvgUri
          imageUrl={walletIconUrl}
          width={iconWidth}
          height={iconHeight}
        />
        <Box ml="sm" alignItems="flex-start">
          <Text variant="bodyLarge">{name}</Text>
          {recommended ? <Text variant="link">Recommended</Text> : null}
        </Box>
      </Box>
      {labelText ? <Label text={labelText} /> : <View />}
    </BaseButton>
  );
};
