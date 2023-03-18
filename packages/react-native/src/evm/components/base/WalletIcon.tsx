import ImageSvgUri from "./ImageSvgUri";

export const WalletIcon = ({
  iconUri,
  size,
}: {
  iconUri: string;
  size: number;
}) => {
  return <ImageSvgUri imageUrl={iconUri} width={size} height={size} />;
};
