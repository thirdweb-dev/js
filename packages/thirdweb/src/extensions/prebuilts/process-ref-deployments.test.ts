import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { getInstalledModules } from "../modules/__generated__/IModularCore/read/getInstalledModules.js";
import {
  deployPublishedContract,
} from "./deploy-published.js";
import { readContract } from "../../transaction/read-contract.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "deployref",
  {
    timeout: 120000,
  },
  () => {
    let multisigAddress: string;
    let mintfeeManagerModuleAddress: string;
    let mintfeeManagerCoreAddress: string;
    let claimableModuleAddress: string;

    beforeAll(async () => {
      multisigAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MultiSig",
        version: "0.0.4",
        salt: "tw",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      mintfeeManagerModuleAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MintFeeManagerModule",
        version: "0.0.1",
        salt: "tw",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      mintfeeManagerCoreAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MintFeeManagerCore",
        version: "0.0.25",
        salt: "tw",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      claimableModuleAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "ClaimableERC721",
        version: "0.0.13",
        salt: "tw",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
    }, 120000);

    it("should set ref contract dependencies", async () => {
        const claimableModule = getContract({
            client: TEST_CLIENT,
            chain: ANVIL_CHAIN,
            address: claimableModuleAddress,
        });
        const fetchedMintFeeManagerAddress = await readContract({
            contract: claimableModule,
            method: "function mintFeeManager() returns (address)",
        });
        expect(fetchedMintFeeManagerAddress.toLowerCase()).to.eq(mintfeeManagerCoreAddress);

        const mintFeeManager = getContract({
            client: TEST_CLIENT,
            chain: ANVIL_CHAIN,
            address: mintfeeManagerCoreAddress,
        });
        const owner = await readContract({
            contract: mintFeeManager,
            method: "function owner() returns (address)",
        });
        const modules = await getInstalledModules({
            contract: mintFeeManager,
        });
        const feeRecipient = await readContract({
            contract: mintFeeManager,
            method: "function getfeeRecipient() returns (address)",
        });
        const fee = await readContract({
            contract: mintFeeManager,
            method: "function getDefaultMintFee() returns (uint256)",
        });
        expect(owner.toLowerCase()).to.eq(multisigAddress);
        expect(modules.length).to.eq(1);
        expect(modules[0]?.implementation.toLowerCase()).to.eq(mintfeeManagerModuleAddress);
        expect(feeRecipient.toLowerCase()).to.eq(multisigAddress);
        expect(fee).to.eq(5n);
    });
  },
);
