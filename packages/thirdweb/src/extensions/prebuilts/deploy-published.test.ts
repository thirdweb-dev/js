import { describe, expect, it } from "vitest";
import {
  ANVIL_CHAIN,
  FORKED_ETHEREUM_CHAIN_WITH_MINING,
} from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { isContractDeployed } from "../../utils/bytecode/is-contract-deployed.js";
import { ENTRYPOINT_ADDRESS_v0_6 } from "../../wallets/smart/lib/constants.js";
import { deployPublishedContract } from "./deploy-published.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "deployPublished",
  {
    timeout: 120000,
  },
  () => {
    it("should deploy a published direct deploy contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "AccountFactory",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          entrypoint: ENTRYPOINT_ADDRESS_v0_6,
        },
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published direct deploy contract deterministically", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "AccountFactory",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          entrypoint: ENTRYPOINT_ADDRESS_v0_6,
        },
        salt: "test",
      });
      expect(address).toBe("0x8a9e25cbf6daa2b56cc0df4669195b8c8c20cda8");
      const isDeployed = await isContractDeployed({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      });
      expect(isDeployed).toBe(true);

      const ethAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: FORKED_ETHEREUM_CHAIN_WITH_MINING,
        account: TEST_ACCOUNT_A,
        contractId: "AccountFactory",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          entrypoint: ENTRYPOINT_ADDRESS_v0_6,
        },
        salt: "test",
      });

      // ensure they are the same address!
      expect(address).toBe(ethAddress);
    });

    it("should deploy a published autofactory contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Airdrop",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          contractURI: "",
        },
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published autofactory contract deterministically", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Airdrop",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          contractURI: "",
        },
        salt: "test",
      });
      expect(address).toBe("0x9A18AD1DdCfA00009C2db7dc78a5746d85feF759");
      const isDeployed = await isContractDeployed({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      });
      expect(isDeployed).toBe(true);

      // deploy on forked ethereum
      const ethAddress = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: FORKED_ETHEREUM_CHAIN_WITH_MINING,
        account: TEST_ACCOUNT_A,
        contractId: "Airdrop",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address,
          contractURI: "",
        },
        salt: "test",
      });
      // ensure they are the same address!
      expect(address).toBe(ethAddress);
    });

    // TODO: Replace these tests' live contracts with mocks
    it("should deploy a published contract with no constructor", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "Counter",
        publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published contract with no deploy type", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "MyToken",
        publisher: "0xc77e556cd96235A7B72d46EAAf13405d698CB2C0",
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });

    it("should deploy a published contract with no fuzzy params", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "DropERC1155",
        contractParams: {
          defaultAdmin: TEST_ACCOUNT_A.address, // defaultAdmin
          name: "test", // name
          symbol: "test", // symbol
          contractURI: "", // contractURI
          trustedForwarders: [], // trustedForwarders
          saleRecipient: TEST_ACCOUNT_A.address, // saleRecipient
          royaltyRecipient: TEST_ACCOUNT_A.address, // royaltyRecipient
          royaltyBps: 0n, // royaltyBps
          platformFeeBps: 0n, // platformFeeBps
          platformFeeRecipient: TEST_ACCOUNT_A.address, // platformFeeRecipient
        },
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);
    });
  },
);
