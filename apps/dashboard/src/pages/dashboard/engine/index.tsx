import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { EngineGeneralPageLayout } from "../../../components/engine/EngineGeneralPageLayout";

const EngineManage: ThirdwebNextPage = () => {
  return <EngineInstancesList engineLinkPrefix="/dashboard/engine" />;
};

EngineManage.getLayout = (page, props) => (
  <AppLayout
    {...props}
    pageContainerClassName="!max-w-full !px-0"
    mainClassName="!pt-0"
  >
    <EngineGeneralPageLayout>{page}</EngineGeneralPageLayout>
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
