import { SnapshotInputSchema } from "../schema/contracts/common/snapshots";
import { SnapshotInput } from "../types/claim-conditions/claim-conditions";

export async function parseSnapshotInputs(inputs: SnapshotInput) {
  try {
    const chunkSize = 25000;

    const chunks = Array.from(
      { length: Math.ceil(inputs.length / chunkSize) },
      (_, i) => inputs.slice(i * chunkSize, i * chunkSize + chunkSize),
    );

    const results = [];

    for (const chunk of chunks) {
      results.push(...(await SnapshotInputSchema.parseAsync(chunk)));
    }

    return results;

  } catch (err: any) {
    throw new Error(`Failed to parse snapshot inputs: ${err.message}`);
  }
}