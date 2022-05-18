import { AppLayout } from "components/app-layouts/app";
import React, { ReactElement } from "react";

export default function PackPage() {
  return <div>Pack page</div>;
}

PackPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;
