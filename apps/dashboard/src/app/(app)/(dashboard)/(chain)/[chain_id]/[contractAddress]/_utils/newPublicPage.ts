import { resolveFunctionSelectors } from "lib/selectors";
import type { ThirdwebContract } from "thirdweb";
import { isERC20 } from "thirdweb/extensions/erc20";

export type NewPublicPageType = "erc20";

export async function shouldRenderNewPublicPage(
  contract: ThirdwebContract,
): Promise<false | { type: NewPublicPageType }> {
  try {
    const functionSelectors = await resolveFunctionSelectors(contract).catch(
      () => undefined,
    );

    if (!functionSelectors) {
      return false;
    }

    const isERC20Contract = isERC20(functionSelectors);

    if (isERC20Contract) {
      return {
        type: "erc20",
      };
    }

    return false;
  } catch {
    return false;
  }
}
