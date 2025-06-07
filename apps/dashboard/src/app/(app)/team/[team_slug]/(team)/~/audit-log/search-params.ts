import { createLoader, parseAsString } from "nuqs/server";

export const searchParams = {
  after: parseAsString,
};

export const searchParamLoader = createLoader(searchParams);
