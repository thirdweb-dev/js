import { IStorage } from "@thirdweb-dev/storage";
import MerkleTree from "merkletreejs";
import {
  SnapshotInputSchema,
  SnapshotSchema,
} from "../schema/contracts/common/snapshots";
import {
  SnapshotInfo,
  SnapshotInput,
} from "../types/claim-conditions/claim-conditions";
import { DuplicateLeafsError } from "./error";
import { BigNumber, BigNumberish, utils } from "ethers";

/**
 * Create a snapshot (merkle tree) from a list of addresses and uploads it to IPFS
 * @param snapshotInput - the list of addresses to hash
 * @param tokenDecimals - the token decimals
 * @param storage - the storage to upload to
 * @returns the generated snapshot and URI
 * @internal
 */
export async function createSnapshot(
  snapshotInput: SnapshotInput,
  tokenDecimals: number,
  storage: IStorage,
): Promise<SnapshotInfo> {
  const input = SnapshotInputSchema.parse(snapshotInput);
  const addresses = input.map((i) => i.address);
  const hasDuplicates = new Set(addresses).size < addresses.length;
  if (hasDuplicates) {
    throw new DuplicateLeafsError();
  }

  const hashedLeafs = input.map((i) =>
    hashLeafNode(i.address, utils.parseUnits(i.maxClaimable, tokenDecimals)),
  );
  const tree = new MerkleTree(hashedLeafs, utils.keccak256, {
    sort: true,
  });

  const snapshot = SnapshotSchema.parse({
    merkleRoot: tree.getHexRoot(),
    claims: input.map((i, index) => {
      const proof = tree.getHexProof(hashedLeafs[index]);
      return {
        address: i.address,
        maxClaimable: i.maxClaimable,
        proof,
      };
    }),
  });

  const uri = await storage.uploadMetadata(snapshot);
  return {
    merkleRoot: tree.getHexRoot(),
    snapshotUri: uri,
    snapshot,
  };
}

/**
 * Hash an address and the corresponding claimable amount
 * @internal
 * @param address - the address
 * @param maxClaimableAmount - the amount
 */
export function hashLeafNode(
  address: string,
  maxClaimableAmount: BigNumberish,
): string {
  return utils.solidityKeccak256(
    ["address", "uint256"],
    [address, BigNumber.from(maxClaimableAmount)],
  );
}
