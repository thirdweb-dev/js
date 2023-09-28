import { useBalance } from "@thirdweb-dev/react-core";
import Text from "./Text";
import LoadingTextAnimation from "./LoadingTextAnimation";
import { baseTheme } from "../../styles/theme";

type TextBalance = {
  textVariant: keyof typeof baseTheme.textVariants;
  tokenAddress?: string;
};

export const TextBalance = ({ textVariant, tokenAddress }: TextBalance) => {
  const balanceQuery = useBalance(tokenAddress);

  return !balanceQuery.data ? (
    <LoadingTextAnimation text="Fetching..." textVariant={textVariant} />
  ) : (
    <Text variant={textVariant}>
      {Number(balanceQuery.data?.displayValue).toFixed(3)}{" "}
      {balanceQuery.data.symbol}
    </Text>
  );
};
