import { AppLayout } from "../../../components/app-layouts/app";
import { EngineGeneralPageLayout } from "../../../components/engine/EngineGeneralPageLayout";
import { CreateEnginePage } from "../../../components/engine/create/CreateEnginePage";
import { PageId } from "../../../page-id";
import type { ThirdwebNextPage } from "../../../utils/types";

const Page: ThirdwebNextPage = () => {
  return <CreateEnginePage />;
};

// Confirmation Dialog for confirming the selected Engine Tier

Page.pageId = PageId.EngineCreate;

export default Page;

Page.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <EngineGeneralPageLayout>{page}</EngineGeneralPageLayout>
  </AppLayout>
);
