import { utils } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { uint8ArrayToHex } from "uint8array-extras";

export function resolveOrGenerateId(requestUId: string | undefined): string {
  if (requestUId === undefined) {
    const ui8arr = new Uint8Array(16);
    uuidv4({}, ui8arr);
    return utils.hexlify(utils.toUtf8Bytes(uint8ArrayToHex(ui8arr)));
  } else {
    return utils.hexlify(requestUId as string);
  }
}
