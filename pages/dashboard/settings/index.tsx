import { useEffect } from "react";
import { useRouter } from "next/router";

const SettingsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/settings/api-keys");
  }, [router]);

  return null;
};

export default SettingsPage;
