import { beforeAll, describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { getContract } from "../../contract/contract.js";
import { getDeployedInfraContract } from "../../contract/deployment/utils/infra.js";
import { readContract } from "../../transaction/read-contract.js";
import { getInstalledModules } from "../modules/__generated__/IModularCore/read/getInstalledModules.js";
import { deployPublishedContract } from "./deploy-published.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "deployref",
  {
    timeout: 120000,
  },
  () => {
    let multisigAddress: string;
    let dummyContractAddress: string;
    let mintfeeManagerModuleAddress: string;
    let mintfeeManagerCoreAddress: string;
    let claimableModuleAddress: string;
    let wethAddress: string;
    let forwarderAddress: string;
    let multiwrapAddress: string;

    beforeAll(async () => {
      multisigAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MultiSig",
        version: "0.0.4",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      dummyContractAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "ContractWithBytes",
        version: "0.0.2",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      mintfeeManagerModuleAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MintFeeManagerModule",
        version: "0.0.1",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      mintfeeManagerCoreAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MintFeeManagerCore",
        version: "0.0.26",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      claimableModuleAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "ClaimableERC721",
        version: "0.0.14",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      wethAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "WETH9",
        salt: "",
      });
      forwarderAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Forwarder",
        version: "0.0.1",
        salt: "",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
      });
      multiwrapAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Multiwrap",
        version: "0.0.4",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        contractParams: {
          _defaultAdmin: TEST_ACCOUNT_A.address,
          _name: "test",
          _symbol: "test",
          _contractURI: "",
          _trustedForwarders: {
            defaultValue: "",
            dynamicValue: {
              type: "address[]",
              refContracts: [
                {
                  contractId: "Forwarder",
                  version: "0.0.1",
                  publisherAddress:
                    "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
                  salt: "",
                },
              ],
            },
          },
          _royaltyRecipient: TEST_ACCOUNT_A.address,
          _royaltyBps: 500n,
        },
      });
    }, 120000);

    it("should set ref contract dependencies for direct deploy contracts", async () => {
      const claimableModule = getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address: claimableModuleAddress,
      });
      const fetchedMintFeeManagerAddress = await readContract({
        contract: claimableModule,
        method: "function mintFeeManager() returns (address)",
      });
      expect(fetchedMintFeeManagerAddress.toLowerCase()).to.eq(
        mintfeeManagerCoreAddress,
      );

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
      expect(modules[0]?.implementation.toLowerCase()).to.eq(
        mintfeeManagerModuleAddress,
      );
      expect(feeRecipient.toLowerCase()).to.eq(multisigAddress);
      expect(fee).to.eq(5n);

      const dummyContract = getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address: dummyContractAddress,
      });
      const dummyContractOwner = await readContract({
        contract: dummyContract,
        method: "function owner() returns (address)",
      });
      expect(dummyContractOwner.toLowerCase()).to.eq(multisigAddress);
    });

    it("should set ref contract dependencies for auto factory contracts", async () => {
      const multiwrap = getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address: multiwrapAddress,
      });
      const fetchedWethAddress = await readContract({
        contract: multiwrap,
        method: "function nativeTokenWrapper() returns (address)",
      });
      const isTrustedForwarder = await readContract({
        contract: multiwrap,
        method: "function isTrustedForwarder(address forwarder) returns (bool)",
        params: [forwarderAddress],
      });
      expect(fetchedWethAddress.toLowerCase()).to.eq(wethAddress);
      expect(isTrustedForwarder).to.be.true;
    });

    it("should correctly compute addresses for deployed contracts with refs", async () => {
      const [
        multisigAddressComputed,
        dummyContractAddressComputed,
        mintfeeManagerModuleAddressComputed,
        mintfeeManagerCoreAddressComputed,
        claimableModuleAddressComputed,
      ] = await Promise.all([
        getDeployedInfraContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "MultiSig",
          version: "0.0.4",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        }),
        getDeployedInfraContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "ContractWithBytes",
          version: "0.0.2",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        }),
        getDeployedInfraContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "MintFeeManagerModule",
          version: "0.0.1",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        }),
        getDeployedInfraContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "MintFeeManagerCore",
          version: "0.0.26",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        }),
        getDeployedInfraContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          contractId: "ClaimableERC721",
          version: "0.0.14",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        }),
      ]);

      expect(multisigAddressComputed?.address.toLowerCase()).to.eq(
        multisigAddress,
      );
      expect(dummyContractAddressComputed?.address.toLowerCase()).to.eq(
        dummyContractAddress,
      );
      expect(mintfeeManagerModuleAddressComputed?.address.toLowerCase()).to.eq(
        mintfeeManagerModuleAddress,
      );
      expect(mintfeeManagerCoreAddressComputed?.address.toLowerCase()).to.eq(
        mintfeeManagerCoreAddress,
      );
      expect(claimableModuleAddressComputed?.address.toLowerCase()).to.eq(
        claimableModuleAddress,
      );
    });
  },
);
