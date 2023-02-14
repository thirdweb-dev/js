import { NextPage } from "next";
import { PageId } from "page-id";
import React, { ReactElement, ReactNode } from "react";

export type ThirdwebNextPage = NextPage<any> & {
  getLayout?: (page: ReactElement, pageProps?: any) => ReactNode;
  pageId: PageId | ((pageProps: any) => PageId);
  fallback?: React.ReactNode;
};
