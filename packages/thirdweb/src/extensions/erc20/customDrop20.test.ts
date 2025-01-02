import { fetchDeployMetadata } from "../../utils/any-evm/deploy-metadata.js";

import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_C } from "../../../test/src/test-wallets.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { toWei } from "../../utils/units.js";
import { deployContractfromDeployMetadata } from "../prebuilts/deploy-published.js";
import { balanceOf } from "./__generated__/IERC20/read/balanceOf.js";
import { claimTo } from "./drops/write/claimTo.js";
import { setClaimConditions } from "./drops/write/setClaimConditions.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "CustomDropERC20",
  {
    retry: 0,
  },
  () => {
    let contract: ThirdwebContract;

    beforeAll(async () => {
      const customDropDeployMetadata = await fetchDeployMetadata({
        client: TEST_CLIENT,
        uri: "ipfs://QmT6h6gZztc2G83gWkJBkNFeq1b9gKrFKnYwgagXMBHV1d",
      });
      const contractAddress = await deployContractfromDeployMetadata({
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_C,
        deployMetadata: customDropDeployMetadata,
        initializeParams: {
          defaultAdmin: TEST_ACCOUNT_C.address,
          name: "TestCustomDropERC20",
          symbol: "TT",
        },
      });

      contract = getContract({
        address: contractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      // this deploys a contract, it may take some time
    }, 60_000);

    it("should allow to claim tokens", async () => {
      await expect(
        balanceOf({ contract, address: TEST_ACCOUNT_C.address }),
      ).resolves.toBe(0n);
      await sendAndConfirmTransaction({
        transaction: setClaimConditions({
          contract,
          phases: [
            {
              startTime: new Date(0),
              maxClaimableSupply: toWei("10"),
            },
          ],
          singlePhaseDrop: true,
        }),
        account: TEST_ACCOUNT_C,
      });
      const claimTx = claimTo({
        contract,
        to: TEST_ACCOUNT_C.address,
        quantity: "1",
        singlePhaseDrop: true,
      });
      await sendAndConfirmTransaction({
        transaction: claimTx,
        account: TEST_ACCOUNT_C,
      });
      await expect(
        balanceOf({ contract, address: TEST_ACCOUNT_C.address }),
      ).resolves.toBe(toWei("1"));
    });
  },
);
