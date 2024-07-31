import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { EngineNavigation } from "components/engine/engine-navigation";
import { SidebarNav } from "core-ui/sidebar/nav";
import { PageId } from "page-id";
import { useState } from "react";
import type { ThirdwebNextPage } from "utils/types";

const EngineManage: ThirdwebNextPage = () => {
  const [connectedInstance, setConnectedInstance] = useState<
    EngineInstance | undefined
  >();

  if (connectedInstance) {
    return (
      // contains its own sidebarnav component
      <EngineNavigation
        instance={connectedInstance}
        setConnectedInstance={setConnectedInstance}
      />
    );
  }

  return (
    <>
      {/* just placeholder, so it doesn't look empty */}
      <SidebarNav title="Engine" />
      <EngineInstancesList setConnectedInstance={setConnectedInstance} />
    </>
  );
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
