import { View } from "react-native";
import BaseButton from "./BaseButton";
import ImageSvgUri from "./ImageSvgUri";
import { Label } from "./Label";
import Text from "./Text";
import Box from "./Box";
import { Palette } from "../../styles/colors";
import { useLocale } from "../../providers/ui-context-provider";

type WalletButtonProps = {
  onPress?: () => void;
  walletIconUrl: string;
  name: string;
  nameColor?: keyof Palette;
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
  nameColor = "textPrimary",
  labelText,
  recommended,
  ...props
}: WalletButtonProps) => {
  const l = useLocale();
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
          <Text variant="bodyLarge" color={nameColor}>
            {name}
          </Text>
          {recommended ? (
            <Text variant="link">{l.connect_wallet_details.recommended}</Text>
          ) : null}
        </Box>
      </Box>
      {labelText ? <Label text={labelText} /> : <View />}
    </BaseButton>
  );
};
