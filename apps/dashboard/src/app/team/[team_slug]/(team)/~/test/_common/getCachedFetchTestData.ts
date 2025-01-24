import "server-only";

import { unstable_cache } from "next/cache";
import { fetchTestData } from "./fetchTestData";

export const getCachedFetchTestData = unstable_cache(
  fetchTestData,
  ["fetchTestData"],
  {
    revalidate: 3600, // 1 hour
  },
);
