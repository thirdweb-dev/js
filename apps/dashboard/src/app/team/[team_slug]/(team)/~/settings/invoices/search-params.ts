import { createLoader, parseAsString } from "nuqs/server";

export const searchParams = {
  cursor: parseAsString,
};

export const searchParamLoader = createLoader(searchParams);
