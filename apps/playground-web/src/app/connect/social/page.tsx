import { CodeExample } from "@/components/code/code-example";
import { SocialProfiles } from "@/components/social/social-profiles";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { PageLayout } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Social APIs | thirdweb Connect",
  description:
    "Retrieve any user's onchain identity from popular protocols like ENS, Lens, Farcaster, and more.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        title="Get any user's onchain identity"
        description={
          <>
            Gain context about your users and their profiles across other apps
            as soon as they sign into your app.
          </>
        }
        docsLink="https://portal.thirdweb.com/connect?utm_source=playground" // TODO: update this once we have Social API docs
      >
        <UserProfiles />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function UserProfiles() {
  return (
    <CodeExample
      header={{
        title: "Social Profiles",
        description:
          "Get user's profiles across apps like ENS, Lens, Farcaster, and more.",
      }}
      preview={<SocialProfiles />}
      code={`import { useSocialProfiles, useActiveAccount } from "thirdweb/react";

        function App(){
        const account = useActiveAccount();
        const { data: profiles } = useSocialProfiles({
          client,
          address: account?.address,
        });

          return (
    <div className="flex flex-col gap-4">
      {profiles?.map((profile) => (
        <ProfileCard avatar={resolveScheme(profile.avatar)} name={profile.name} type={profile.type} bio={profile.bio} />
      ))
}
    </div>);
}; `}
      lang="tsx"
    />
  );
}
