import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { SidebarNav } from "core-ui/sidebar/nav";
import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";

const EngineManage: ThirdwebNextPage = () => {
  return <EngineInstancesList />;
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SidebarNav
      title="Engine"
      links={[
        {
          name: "overview",
          path: "/dashboard/engine",
          title: "Overview",
        },
        {
          name: "create",
          path: "/dashboard/engine/create",
          title: "Create Engine",
        },
      ]}
    />
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
