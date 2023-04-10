import { expect } from 'chai';
import { ethers } from 'ethers';
import { DuplicateLeafsError, createSnapshot } from '../../src/evm';
import { SnapshotFormatVersion } from '../../src/evm/common/sharded-merkle-tree';
import { sdk } from "./before-setup";

describe('createSnapshot', () => {
  const testSnapshotInput = [
    { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', maxClaimable: '1' },
    { address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88', maxClaimable: '1' },
  ];

  const tokenDecimals = 0;
  const provider = new ethers.providers.JsonRpcProvider();
  const storage = sdk.storage;

  it('should throw error if duplicate addresses are found', async () => {
    const duplicateSnapshotInput = [
      ...testSnapshotInput,
      { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', maxClaimable: '1' },
    ];

    try {
      await createSnapshot(
        duplicateSnapshotInput,
        tokenDecimals,
        provider,
        storage,
        SnapshotFormatVersion.V1,
      );
      expect.fail('Expected error to be thrown');
    } catch (error) {
      expect(error).to.be.instanceOf(DuplicateLeafsError);
    }
  });

  it('should create a valid snapshot', async () => {
    const snapshotInfo = await createSnapshot(
      testSnapshotInput,
      tokenDecimals,
      provider,
      storage,
      SnapshotFormatVersion.V1,
    );

    expect(snapshotInfo.merkleRoot).to.exist.and.to.be.a('string');
    expect(snapshotInfo.snapshotUri).to.exist.and.to.be.a('string');
  });

  it('should create a valid snapshot with chunking', async () => {
    const snapshotInfo = await createSnapshot(
      testSnapshotInput,
      tokenDecimals,
      provider,
      storage,
      SnapshotFormatVersion.V1,
      50000, // chunkSize
    );

    expect(snapshotInfo.merkleRoot).to.exist.and.to.be.a('string');
    expect(snapshotInfo.snapshotUri).to.exist.and.to.be.a('string');
  });
});