import { beforeEach, describe, expect, it } from "vitest";
import {
  clearCache,
  resolveSignature,
  resolveSignatures,
} from "./resolve-signature.js";

describe.skip("resolveSignature", () => {
  beforeEach(() => {
    clearCache();
  });
  it("resolves a function signature", async () => {
    const res = await resolveSignature("0x1f931c1c");
    expect(res.function).toMatchInlineSnapshot(
      `"function diamondCut((address,uint8,bytes4[])[],address,bytes)"`,
    );
  });

  it("resolves an event signature", async () => {
    const res = await resolveSignature("0x1f931c1c");
    expect(res.event).toMatchInlineSnapshot(
      `"event DiamondCut((address,uint8,bytes4[])[],address,bytes)"`,
    );
  });
});

const TEST_SIGS = [
  "0x763b948a",
  "0x42784f14",
  "0x7b55f07f",
  "0x882ffab2",
  "0x55e2eb4b",
  "0xbc5d2522",
  "0x9ff2a527",
  "0x39a209df",
  "0x494ea092",
  "0x722b6cd2",
  "0xbf0806ba",
  "0xb8f44a5f",
  "0xecd32245",
  "0x3e98dd6c",
  "0x8047f2ce",
  "0xd3606249",
  "0xc78da66e",
  "0xe0d20147",
  "0x64e5b7a9",
  "0x2eac7022",
  "0xe9332638",
  "0x6562e70e",
];

describe.skip("resolveSignatures", () => {
  beforeEach(() => {
    clearCache();
  });
  it("resolves multiple signatures", async () => {
    const res = await resolveSignatures(TEST_SIGS);
    expect(res).toMatchInlineSnapshot(`
      {
        "events": [],
        "functions": [
          "function balanceOfToken(address,uint256,uint256)",
          "function batchCraftInstallations((uint16,uint16,uint40)[])",
          "function claimInstallations(uint256[])",
          "function craftInstallations(uint16[],uint40[])",
          "function equipInstallation(address,uint256,uint256)",
          "function getAltarLevel(uint256)",
          "function getCraftQueue(address)",
          "function getInstallationType(uint256)",
          "function getInstallationTypes(uint256[])",
          "function getInstallationUnequipType(uint256)",
          "function getLodgeLevel(uint256)",
          "function getReservoirCapacity(uint256)",
          "function getReservoirStats(uint256)",
          "function installationBalancesOfToken(address,uint256)",
          "function installationBalancesOfTokenByIds(address,uint256,uint256[])",
          "function installationBalancesOfTokenWithTypes(address,uint256)",
          "function installationsBalances(address)",
          "function installationsBalancesWithTypes(address)",
          "function reduceCraftTime(uint256[],uint40[])",
          "function spilloverRateAndRadiusOfId(uint256)",
          "function unequipInstallation(address,uint256,uint256)",
          "function upgradeComplete(uint256)",
        ],
      }
    `);
  });
});
