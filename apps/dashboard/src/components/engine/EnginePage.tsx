import { useRouter } from "next/router";
import type { EngineInstance } from "../../@3rdweb-sdk/react/hooks/useEngine";
import { PageId } from "../../page-id";
import type { ThirdwebNextPage } from "../../utils/types";
import { AppLayout } from "../app-layouts/app";
import {
  type ActivePage,
  EnginePageLayout,
  PageLoading,
} from "./EnginePageLayout";

export function createEnginePage(
  activePage: ActivePage,
  PageContent: React.FC<{ instance: EngineInstance }>,
): ThirdwebNextPage {
  const Page: ThirdwebNextPage = () => {
    const router = useRouter();
    const engineId = router.query.engineId;

    if (typeof engineId !== "string") {
      return <PageLoading />;
    }

    return (
      <EnginePageLayout
        activePage={activePage}
        engineId={engineId}
        content={PageContent}
      />
    );
  };

  Page.pageId = PageId.EngineManage;

  Page.getLayout = (page, props) => (
    <AppLayout {...props} hasSidebar={true}>
      {page}
    </AppLayout>
  );

  return Page;
}
