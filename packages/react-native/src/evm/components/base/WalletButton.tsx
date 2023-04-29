import BaseButton from "./BaseButton";
import ImageSvgUri from "./ImageSvgUri";
import Text from "./Text";

type WalletButtonProps = {
  onPress: () => void;
  walletIconUrl: string;
  name: string;
} & (typeof BaseButton)["arguments"];

export const WalletButton = ({
  mb,
  onPress,
  walletIconUrl,
  name,
}: WalletButtonProps) => {
  return (
    <BaseButton
      mb={mb}
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      paddingHorizontal="md"
      paddingVertical="sm"
      gap="md"
      borderRadius="sm"
      backgroundColor="backgroundHighlight"
      onPress={onPress}
    >
      <ImageSvgUri imageUrl={walletIconUrl} width={32} height={32} />
      <Text variant="bodyLarge">{name}</Text>
    </BaseButton>
  );
};
