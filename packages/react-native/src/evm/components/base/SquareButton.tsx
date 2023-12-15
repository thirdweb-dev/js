import BaseButton from "./BaseButton";
import ImageSvgUri from "./ImageSvgUri";
import Text from "./Text";

type SquareButtonProps = {
  onPress: () => void;
  iconUrl: string;
  size: number;
  name?: string;
} & (typeof BaseButton)["arguments"];

export const SquareButton = ({
  onPress,
  iconUrl,
  name,
  size,
  ...props
}: SquareButtonProps) => {
  return (
    <BaseButton
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      borderRadius="sm"
      borderColor="border"
      padding="sm"
      onPress={onPress}
      {...props}
    >
      <ImageSvgUri imageUrl={iconUrl} width={size} height={size} />
      {name ? (
        <Text
          variant="bodySmallSecondary"
          numberOfLines={1}
          mt="xs"
          fontSize={14}
          lineHeight={16}
        >
          {name}
        </Text>
      ) : null}
    </BaseButton>
  );
};
