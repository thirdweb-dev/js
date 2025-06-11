"use client";

import { useQuery } from "@tanstack/react-query";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MinikitProvider({
  children,
}: { children: React.ReactNode }) {
  useQuery({
    queryKey: ["minikit-install"],
    queryFn: async () => {
      try {
        MiniKit.install();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  });

  return <>{children}</>;
}
