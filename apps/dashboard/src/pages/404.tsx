import { PageId } from "page-id";
import type { ThirdwebNextPage } from "utils/types";
import { NotFoundPage } from "../components/not-found-page";

const PageNotFound: ThirdwebNextPage = () => {
  return <NotFoundPage />;
};

PageNotFound.pageId = PageId.PageNotFound;

export default PageNotFound;
