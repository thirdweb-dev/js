import { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import { AppLayout } from "components/app-layouts/app";
import { EngineInstancesList } from "components/engine/engine-list";
import { EngineNavigation } from "components/engine/engine-navigation";
import { EngineNoConnectedWallet } from "components/engine/no-connected-wallet";
import { EngineSidebar } from "core-ui/sidebar/engine";
import { PageId } from "page-id";
import { useState } from "react";
import { ThirdwebNextPage } from "utils/types";

const EngineManage: ThirdwebNextPage = () => {
  const { isLoggedIn } = useLoggedInUser();
  const [connectedInstance, setConnectedInstance] = useState<
    EngineInstance | undefined
  >();

  if (!isLoggedIn) {
    return <EngineNoConnectedWallet />;
  }

  if (connectedInstance) {
    return (
      <EngineNavigation
        instance={connectedInstance}
        setConnectedInstance={setConnectedInstance}
      />
    );
  }

  return <EngineInstancesList setConnectedInstance={setConnectedInstance} />;
};

EngineManage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <EngineSidebar activePage="manage" />
    {page}
  </AppLayout>
);

EngineManage.pageId = PageId.EngineManage;

export default EngineManage;
