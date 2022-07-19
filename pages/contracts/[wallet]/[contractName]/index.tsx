import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ContractNamePage() {
  const { query, replace } = useRouter();
  useEffect(() => {
    replace(`/contracts/${query.wallet}/${query.contractName}/latest`);
    // only ever want to replace the path once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>redirecting...</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    redirect: {
      permanent: false,
      destination: `/contracts/${query.wallet}/${query.contractName}/latest`,
    },
  };
};
