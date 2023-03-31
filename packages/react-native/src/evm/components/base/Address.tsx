import { Theme } from "../../styles/theme";
import { shortenString } from "../../utils/addresses";
import Text from "./Text";

export const Address = ({
  address,
  variant = "bodyLarge",
}: {
  address: string;
  variant?: keyof Theme["textVariants"];
}) => {
  return <Text variant={variant}>{shortenString(address)}</Text>;
};
