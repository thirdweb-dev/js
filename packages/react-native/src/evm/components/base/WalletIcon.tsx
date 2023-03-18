import { Image } from "react-native";

export const WalletIcon = ({
  iconUri,
  size,
}: {
  iconUri: string;
  size: number;
}) => {
  return (
    <Image
      alt="wallet icon"
      style={{ height: size, width: size }}
      source={{ uri: iconUri }}
    />
  );
};
