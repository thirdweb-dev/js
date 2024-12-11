import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
import Link from "next/link";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../../../login/loginRedirect";
import { GuidesSection } from "./components/GuideSection";
import { SDKSection } from "./components/SDKSection";
import { YourFilesSection } from "./your-files";

export default async function Page(props: {
  params: Promise<{
    team_slug: string;
  }>;
}) {
  const params = await props.params;
  const authToken = await getAuthToken();

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}/~/usage/storage`);
  }

  return (
    <div className="flex flex-col gap-14">
      <YourFilesSection authToken={authToken} />
      <GatewaySection />
      <CLISection />
      <SDKSection />
      <GuidesSection />
    </div>
  );
}

function GatewaySection() {
  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg tracking-tight">
        IPFS Gateway
      </h2>

      <p className="text-muted-foreground">
        This is the structure of your unique gateway URL
      </p>

      <PlainTextCodeBlock
        code="https://<your-client-id>.ipfscdn.io/ipfs/"
        className="my-2"
      />

      <p className="text-muted-foreground">
        Gateway requests need to be authenticated using a client ID. You can get
        it from the Project Settings page.
      </p>
    </div>
  );
}

function CLISection() {
  return (
    <div>
      <h2 className="mb-2 font-semibold text-lg tracking-tight">
        Upload with thirdweb CLI
      </h2>

      <p className="text-muted-foreground">
        You can easily upload files and folders to IPFS from your terminal using
        thirdweb CLI
      </p>

      <PlainTextCodeBlock
        code="npx thirdweb upload ./path/to/file-or-folder/"
        className="my-2"
      />

      <p className="text-muted-foreground">
        If this is the first time that you are running this command, you may
        have to first login using your secret key.{" "}
        <Link
          href="https://portal.thirdweb.com/cli/upload"
          target="_blank"
          className="text-foreground hover:underline"
        >
          Learn more about thirdweb CLI
        </Link>
      </p>
    </div>
  );
}
