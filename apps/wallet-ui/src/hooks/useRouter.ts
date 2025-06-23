/* eslint-disable no-restricted-imports */

import { useRouter as useNextRouter } from "next/navigation";
import { isMultiTenant } from "@/lib/utils";

export function useRouter() {
  const router = useNextRouter();

  return {
    ...router,
    push: (path: string, ecosystemId: string) => {
      if (isMultiTenant && ecosystemId) {
        return router.push(`/${ecosystemId}${path}`);
      }
      return router.push(path);
    },
  };
}
