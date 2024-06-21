import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { EngineNavigation } from "components/engine/engine-navigation";
import { EngineNoConnectedWallet } from "components/engine/no-connected-wallet";
import { SidebarNav } from "core-ui/sidebar/nav";

import { PageId } from "page-id";
import { useState } from "react";
import type { ThirdwebNextPage } from "utils/types";

const EngineManage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const [connectedInstance, setConnectedInstance] = useState<
    EngineInstance | undefined
  >();

  if (!isLoggedIn) {
    return (
      <>
        {/* just placeholder, so it doesn't look empty */}
        <SidebarNav title="Engine" />
        <EngineNoConnectedWallet />
      </>
    );
  }

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
