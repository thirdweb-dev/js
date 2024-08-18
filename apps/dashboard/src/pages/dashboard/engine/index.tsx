import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { EngineSidebar } from "../../../components/engine/EngineSidebar";

const EngineManage: ThirdwebNextPage = () => {
  return <EngineInstancesList />;
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar />
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
