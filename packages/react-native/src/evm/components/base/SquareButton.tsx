import BaseButton from "./BaseButton";
import Box from "./Box";
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
      borderWidth={0}
      borderRadius="sm"
      width={size}
      height={size}
      onPress={onPress}
      {...props}
    >
      <Box borderWidth={0} borderRadius="lg">
        <ImageSvgUri imageUrl={iconUrl} width={size} height={size} />
      </Box>
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
