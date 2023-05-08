import { Theme } from "../../styles/theme";
import { shortenWalletAddress } from "../../utils/addresses";
import Text from "./Text";

type AddressProps = {
  address: string;
  variant?: keyof Theme["textVariants"];
} & (typeof Text)["arguments"];

export const Address = ({
  address,
  variant = "bodyLarge",
  ...props
}: AddressProps) => {
  return (
    <Text variant={variant} {...props}>
      {shortenWalletAddress(address)}
    </Text>
  );
};
