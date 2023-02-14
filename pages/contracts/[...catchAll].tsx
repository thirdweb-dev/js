// handle old contract paths - redirect to /explore
import { GetServerSideProps } from "next";

export default function page() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/explore",
      permanent: false,
    },
  };
};
