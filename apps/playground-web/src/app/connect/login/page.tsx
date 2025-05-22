import { CodeExample } from "@/components/code/code-example";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { PageLayout } from "../../../components/blocks/APIHeader";
import { BasicLoginExample } from "../../../components/login/basic-example";

export const metadata: Metadata = {
  metadataBase,
  title: "Login | thirdweb Connect",
  description: "TODO",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Login"
        description={
          <>Let users login to your app using any authentication provider.</>
        }
        docsLink="https://portal.thirdweb.com/typescript/v5/auth?utm_source=playground"
      >
        <div className="flex flex-col gap-14">
          <CodeExample
            lang="ts"
            code={"TODO"}
            preview={<BasicLoginExample />}
          />
        </div>
      </PageLayout>
    </ThirdwebProvider>
  );
}
