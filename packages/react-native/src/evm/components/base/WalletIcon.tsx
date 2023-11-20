import Box from "./Box";
import ImageSvgUri from "./ImageSvgUri";

export const WalletIcon = ({
  iconUri,
  size,
}: {
  iconUri: string;
  size: number;
}) => {
  return (
    <Box borderRadius="sm" overflow="hidden">
      <ImageSvgUri imageUrl={iconUri} width={size} height={size} />
    </Box>
  );
};
