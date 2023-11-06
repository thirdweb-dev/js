import { SnapshotInputSchema } from "../schema/contracts/common/snapshots";
import { SnapshotInput } from "../types/claim-conditions/claim-conditions";

export async function parseSnapshotInputs(inputs: SnapshotInput) {
  const chunkSize = 25000;
  const chunks = Array.from(
    { length: Math.ceil(inputs.length / chunkSize) },
    (_, i) => inputs.slice(i * chunkSize, i * chunkSize + chunkSize),
  );

  const results = [];
  const parsedChunks = await Promise.all(
    chunks.map((chunk) => SnapshotInputSchema.parseAsync(chunk)),
  );
  for (const chunk of parsedChunks) {
    results.push(...chunk);
  }

  return results;
}
