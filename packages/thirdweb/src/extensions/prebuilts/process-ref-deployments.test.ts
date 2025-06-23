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
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "MultiSig",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.4",
      });
      dummyContractAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "ContractWithBytes",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.2",
      });
      mintfeeManagerModuleAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "MintFeeManagerModule",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.1",
      });
      mintfeeManagerCoreAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "MintFeeManagerCore",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.26",
      });
      claimableModuleAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "ClaimableERC721",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.14",
      });
      wethAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "WETH9",
        salt: "",
      });
      forwarderAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "Forwarder",
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        salt: "",
        version: "0.0.1",
      });
      multiwrapAddress = await deployPublishedContract({
        account: TEST_ACCOUNT_A,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        contractId: "Multiwrap",
        contractParams: {
          _contractURI: "",
          _defaultAdmin: TEST_ACCOUNT_A.address,
          _name: "test",
          _royaltyBps: 500n,
          _royaltyRecipient: TEST_ACCOUNT_A.address,
          _symbol: "test",
          _trustedForwarders: {
            defaultValue: "",
            dynamicValue: {
              refContracts: [
                {
                  contractId: "Forwarder",
                  publisherAddress:
                    "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
                  salt: "",
                  version: "0.0.1",
                },
              ],
              type: "address[]",
            },
          },
        },
        publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
        version: "0.0.4",
      });
    }, 120000);

    it("should set ref contract dependencies for direct deploy contracts", async () => {
      const claimableModule = getContract({
        address: claimableModuleAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      const fetchedMintFeeManagerAddress = await readContract({
        contract: claimableModule,
        method: "function mintFeeManager() returns (address)",
      });
      expect(fetchedMintFeeManagerAddress.toLowerCase()).to.eq(
        mintfeeManagerCoreAddress,
      );

      const mintFeeManager = getContract({
        address: mintfeeManagerCoreAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
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
        address: dummyContractAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
      });
      const dummyContractOwner = await readContract({
        contract: dummyContract,
        method: "function owner() returns (address)",
      });
      expect(dummyContractOwner.toLowerCase()).to.eq(multisigAddress);
    });

    it("should set ref contract dependencies for auto factory contracts", async () => {
      const multiwrap = getContract({
        address: multiwrapAddress,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
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
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "MultiSig",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
          version: "0.0.4",
        }),
        getDeployedInfraContract({
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "ContractWithBytes",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
          version: "0.0.2",
        }),
        getDeployedInfraContract({
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "MintFeeManagerModule",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
          version: "0.0.1",
        }),
        getDeployedInfraContract({
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "MintFeeManagerCore",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
          version: "0.0.26",
        }),
        getDeployedInfraContract({
          chain: ANVIL_CHAIN,
          client: TEST_CLIENT,
          contractId: "ClaimableERC721",
          publisher: "0x6453a486d52e0EB6E79Ec4491038E2522a926936",
          version: "0.0.14",
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
