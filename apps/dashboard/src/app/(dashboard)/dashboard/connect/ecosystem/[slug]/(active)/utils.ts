import type { PartnerPermission } from "../../types.ts";

export const isValidPermission = (
  permission: string,
): permission is PartnerPermission =>
  ["FULL_CONTROL_V1", "PROMPT_USER_V1"].includes(permission);
