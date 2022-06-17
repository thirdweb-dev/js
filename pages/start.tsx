import { AppLayout } from "components/app-layouts/app";
import { ReactElement } from "react";

export default function StartPage() {
  return (
    <div>
      <h1>Start Page</h1>
      <p>
        This is the start page. It is the first page that is loaded when the
        application is started.
      </p>
    </div>
  );
}

StartPage.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
