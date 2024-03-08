import { useEffect } from "react";
import { useRouter } from "next/router";

const PaymentsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/payments/contracts");
  }, [router]);

  return null;
};

export default PaymentsPage;
