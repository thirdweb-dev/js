import { AppLayout } from "components/app-layouts/app";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "pages/_app";
import React, { ReactElement } from "react";

const PackPage: ThirdwebNextPage = () => {
  return <div>Pack page</div>;
};

PackPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

PackPage.pageId = PageId.PackContract;

export default PackPage;
