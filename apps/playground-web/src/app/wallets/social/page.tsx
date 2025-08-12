import { GlobeIcon } from "lucide-react";
import { PageLayout } from "@/components/blocks/APIHeader";
import { CodeExample } from "@/components/code/code-example";
import { SocialProfiles } from "@/components/social/social-profiles";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { createMetadata } from "@/lib/metadata";

const title = "Social Profiles";
const description =
  "Enhance wallet authentication and context about user profiles with social identity data from ENS, Lens, and Farcaster";
const ogDescription =
  "Enhance wallet authentication with social identity data from ENS, Lens, and Farcaster. Gain context-rich profiles on user login.";

export const metadata = createMetadata({
  description: ogDescription,
  title,
  image: {
    icon: "wallets",
    title,
  },
});

export default function Page() {
  return (
    <ThirdwebProvider>
      <PageLayout
        icon={GlobeIcon}
        title={title}
        description={description}
        docsLink="https://portal.thirdweb.com/wallets?utm_source=playground"
      >
        <UserProfiles />
      </PageLayout>
    </ThirdwebProvider>
  );
}

function UserProfiles() {
  return (
    <CodeExample
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
      header={{
        description:
          "Get user's profiles across apps like ENS, Lens, Farcaster, and more.",
        title: "Social Profiles",
      }}
      lang="tsx"
      preview={<SocialProfiles />}
    />
  );
}
