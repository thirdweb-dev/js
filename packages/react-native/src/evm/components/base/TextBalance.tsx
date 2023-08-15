import { useBalance } from "@thirdweb-dev/react-core";
import Text from "./Text";
import LoadingTextAnimation from "./LoadingTextAnimation";
import { baseTheme } from "../../styles/theme";

type TextBalance = {
  textVariant: keyof typeof baseTheme.textVariants;
};

export const TextBalance = ({ textVariant }: TextBalance) => {
  const balanceQuery = useBalance();

  return !balanceQuery.data ? (
    <LoadingTextAnimation text="Fetching..." textVariant={textVariant} />
  ) : (
    <Text variant={textVariant}>
      {Number(balanceQuery.data?.displayValue).toFixed(3)}{" "}
      {balanceQuery.data.symbol}
    </Text>
  );
};
