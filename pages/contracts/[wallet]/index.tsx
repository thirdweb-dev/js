import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserPage() {
  const wallet = useSingleQueryParam("wallet");
  const router = useRouter();

  // We do this so it doesn't break for users that haven't updated their CLI
  useEffect(() => {
    const previousPath = router.asPath.split("/")[2];
    console.log({ previousPath, wallet });
    if (previousPath !== "[wallet]" && wallet && wallet.startsWith("Qm")) {
      router.replace(`/contracts/deploy/${previousPath}`);
    }
  }, [wallet, router]);

  return null;
}
