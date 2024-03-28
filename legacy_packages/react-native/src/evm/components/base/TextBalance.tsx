import { useBalance } from "@thirdweb-dev/react-core";
import Text from "./Text";
import LoadingTextAnimation from "./LoadingTextAnimation";
import { baseTheme } from "../../styles/theme";
import { useLocale } from "../../providers/ui-context-provider";

type TextBalance = {
  textVariant: keyof Omit<typeof baseTheme.textVariants, "defaults">;
  tokenAddress?: string;
};

export const TextBalance = ({ textVariant, tokenAddress }: TextBalance) => {
  const balanceQuery = useBalance(tokenAddress);
  const l = useLocale();

  return !balanceQuery.data ? (
    <LoadingTextAnimation text={l.common.fetching} textVariant={textVariant} />
  ) : (
    <Text variant={textVariant}>
      {Number(balanceQuery.data?.displayValue).toFixed(3)}{" "}
      {balanceQuery.data.symbol}
    </Text>
  );
};
