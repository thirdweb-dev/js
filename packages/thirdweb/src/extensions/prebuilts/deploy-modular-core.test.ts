import { describe, expect, it } from "vitest";
import { ANVIL_CHAIN } from "../../../test/src/chains.js";
import { TEST_CLIENT } from "../../../test/src/test-clients.js";
import { TEST_ACCOUNT_A } from "../../../test/src/test-wallets.js";
import { ADDRESS_ZERO } from "../../constants/addresses.js";
import { getContract } from "../../contract/contract.js";
import { sendTransaction } from "../../transaction/actions/send-transaction.js";
import { installPublishedExtension } from "../modular/ModularCore/write/installPublishedExtension.js";
import { uninstallExtensionByProxy } from "../modular/ModularCore/write/uninstallExtensionByProxy.js";
import { uninstallPublishedExtension } from "../modular/ModularCore/write/uninstallPublishedExtension.js";
import { getInstalledExtensions } from "../modular/__generated__/ModularCore/read/getInstalledExtensions.js";
import { deployPublishedContract } from "./deploy-published.js";

describe.runIf(process.env.TW_SECRET_KEY)(
  "deployModularCore",
  {
    timeout: 120000,
  },
  () => {
    it("should deploy a published autofactory modular core contract", async () => {
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "DemoCore",
        contractParams: [TEST_ACCOUNT_A.address, [], ["0x"]],
        publisher: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      });
      expect(address).toBeDefined();
      expect(address.length).toBe(42);

      const installedExtensions = await getInstalledExtensions({
        contract: getContract({
          client: TEST_CLIENT,
          chain: ANVIL_CHAIN,
          address,
        }),
      });
      expect(installedExtensions.length).toBe(0);
    });

    it("should install and uninstall an extension by proxy address", async () => {
      // deploy core contract with extension
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "DemoCore",
        contractParams: [TEST_ACCOUNT_A.address, [], ["0x"]],
        publisher: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      });

      const core = getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      });

      // install extension with published name
      const installTransaction = installPublishedExtension({
        contract: core,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
        extensionName: "DemoExtensionWithFunctions",
        publisherAddress: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      });
      await sendTransaction({
        transaction: installTransaction,
        account: TEST_ACCOUNT_A,
      });

      // get installed extension proxy address
      let installedExtensions = await getInstalledExtensions({
        contract: core,
      });
      const extensionAddress = installedExtensions[0]?.implementation;
      expect(extensionAddress).to.not.equal(ADDRESS_ZERO);

      // uninstall extension
      const uninstallTransaction = uninstallExtensionByProxy({
        contract: core,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        extensionProxyAddress: extensionAddress as string,
        extensionData: "0x",
      });
      await sendTransaction({
        transaction: uninstallTransaction,
        account: TEST_ACCOUNT_A,
      });

      installedExtensions = await getInstalledExtensions({
        contract: core,
      });

      expect(installedExtensions.length).toBe(0);
    });

    it("should install and uninstall extensions by publish name", async () => {
      // deploy core contract with extension
      const address = await deployPublishedContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        account: TEST_ACCOUNT_A,
        contractId: "DemoCore",
        contractParams: [TEST_ACCOUNT_A.address, [], ["0x"]],
        publisher: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      });

      const core = getContract({
        client: TEST_CLIENT,
        chain: ANVIL_CHAIN,
        address,
      });

      // install extension with published name
      const installTransaction = installPublishedExtension({
        contract: core,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        account: TEST_ACCOUNT_A,
        extensionName: "DemoExtensionWithFunctions",
        publisherAddress: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
      });
      await sendTransaction({
        transaction: installTransaction,
        account: TEST_ACCOUNT_A,
      });

      let installedExtensions = await getInstalledExtensions({
        contract: core,
      });

      expect(installedExtensions.length).toBe(1);

      // uninstall extension
      const uninstallTransaction = uninstallPublishedExtension({
        contract: core,
        chain: ANVIL_CHAIN,
        client: TEST_CLIENT,
        extensionName: "DemoExtensionWithFunctions",
        publisherAddress: "0xFD78F7E2dF2B8c3D5bff0413c96f3237500898B3",
        extensionData: "0x",
      });
      await sendTransaction({
        transaction: uninstallTransaction,
        account: TEST_ACCOUNT_A,
      });

      installedExtensions = await getInstalledExtensions({
        contract: core,
      });

      expect(installedExtensions.length).toBe(0);
    });
  },
);
