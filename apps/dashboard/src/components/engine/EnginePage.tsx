import type { EngineInstance } from "@3rdweb-sdk/react/hooks/useEngine";
import { useRouter } from "next/router";
import { PageId } from "../../page-id";
import type { ThirdwebNextPage } from "../../utils/types";
import { AppLayout } from "../app-layouts/app";
import {
  EngineSidebarLayout,
  PageLoading,
  WithEngineInstance,
} from "./EnginePageLayout";

export function createEnginePage(
  PageContent: React.FC<{ instance: EngineInstance }>,
): ThirdwebNextPage {
  const Page: ThirdwebNextPage = () => {
    const router = useRouter();
    const engineId = router.query.engineId;

    if (typeof engineId !== "string") {
      return <PageLoading />;
    }

    return (
      <EngineSidebarLayout rootPath="/dashboard/engine" engineId={engineId}>
        <WithEngineInstance
          engineId={engineId}
          content={PageContent}
          rootPath="/dashboard/engine"
        />
      </EngineSidebarLayout>
    );
  };

  Page.pageId = PageId.EngineManage;

  Page.getLayout = (page, props) => (
    <AppLayout
      {...props}
      pageContainerClassName="!max-w-full !px-0"
      mainClassName="!pt-0"
    >
      {page}
    </AppLayout>
  );

  return Page;
}
