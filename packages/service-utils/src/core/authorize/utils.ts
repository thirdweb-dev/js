import crypto from "node:crypto";

export const hashKey = (str: string): string => {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
};
