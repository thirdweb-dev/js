import { useEffect } from "react";
import { useRouter } from "next/router";

const DashboardConnect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/connect/playground");
  }, [router]);

  return null;
};

export default DashboardConnect;
