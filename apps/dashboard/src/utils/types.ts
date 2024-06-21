import type { NextPage } from "next";
import type { PageId } from "page-id";
import type { ReactElement, ReactNode } from "react";

// biome-ignore lint/suspicious/noExplicitAny: FIXME
export type ThirdwebNextPage = NextPage<any> & {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  pageId: PageId | ((pageProps: any) => PageId);
  fallback?: React.ReactNode;
};
