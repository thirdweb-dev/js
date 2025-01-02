/* eslint-disable no-restricted-imports */

import { isMultiTenant } from "@/lib/utils";
import { useRouter as useNextRouter } from "next/navigation";

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
