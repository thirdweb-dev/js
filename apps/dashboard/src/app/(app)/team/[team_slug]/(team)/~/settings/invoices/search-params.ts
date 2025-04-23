import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";

export const searchParams = {
  cursor: parseAsString,
  status: parseAsStringEnum(["open"]),
};

export const searchParamLoader = createLoader(searchParams);
