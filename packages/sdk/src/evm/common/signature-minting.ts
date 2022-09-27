import { utils } from "ethers";
import { v4 as uuidv4 } from "uuid";

export function resolveOrGenerateId(requestUId: string | undefined): string {
  if (requestUId === undefined) {
    const buffer = Buffer.alloc(16);
    uuidv4({}, buffer);
    return utils.hexlify(utils.toUtf8Bytes(buffer.toString("hex")));
  } else {
    return utils.hexlify(requestUId as string);
  }
}
