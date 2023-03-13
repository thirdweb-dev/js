import { Theme } from "../../styles/theme";
import { shortenString } from "../../utils/addresses";
import Text from "./Text";
import React from "react";

export const Address = ({
  address,
  variant = "bodyLarge",
}: {
  address: string;
  variant?: keyof Theme["textVariants"];
}) => {
  return <Text variant={variant}>{shortenString(address)}</Text>;
};
