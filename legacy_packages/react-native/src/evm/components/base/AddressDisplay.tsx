import { shortenAddress } from "@thirdweb-dev/react-core";
import { Theme } from "../../styles/theme";
import Text from "./Text";

type AddressProps = {
  address?: string;
  variant?: keyof Theme["textVariants"];
  extraShort?: boolean;
} & React.ComponentProps<typeof Text>;

export const AddressDisplay = ({
  address = "",
  variant = "bodyLarge",
  extraShort,
  ...props
}: AddressProps) => {
  return (
    <Text variant={variant} {...props}>
      {shortenAddress(address, extraShort)}
    </Text>
  );
};
