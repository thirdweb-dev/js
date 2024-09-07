import { AppLayout } from "../../../components/app-layouts/app";
import { EngineGeneralPageLayout } from "../../../components/engine/EngineGeneralPageLayout";
import { EngineImportPage } from "../../../components/engine/import/EngineImportPage";
import { PageId } from "../../../page-id";
import type { ThirdwebNextPage } from "../../../utils/types";

const Page: ThirdwebNextPage = () => {
  return <EngineImportPage />;
};

Page.pageId = PageId.EngineCreate;

Page.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <EngineGeneralPageLayout>{page}</EngineGeneralPageLayout>
  </AppLayout>
);

export default Page;
