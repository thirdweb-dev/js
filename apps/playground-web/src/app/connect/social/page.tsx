import { CodeExample } from "@/components/code/code-example";
import { SocialProfiles } from "@/components/social/social-profiles";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { metadataBase } from "@/lib/constants";
import type { Metadata } from "next";
import { APIHeader } from "../../../components/blocks/APIHeader";

export const metadata: Metadata = {
  metadataBase,
  title: "Social APIs | thirdweb Connect",
  description:
    "Retrieve any user's onchain identity from popular protocols like ENS, Lens, Farcaster, and more.",
};

export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <APIHeader
          title="Get any user's onchain identity"
          description={
            <>
              Gain context about your users and their profiles across other apps
              as soon as they sign into your app.
            </>
          }
          docsLink="https://portal.thirdweb.com/connect?utm_source=playground" // TODO: update this once we have Social API docs
          heroLink="/in-app-wallet.png"
        />

        <section className="space-y-8">
          <UserProfiles />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function UserProfiles() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Social Profiles
        </h2>
        <p className="max-w-[600px]">
          Get users&apos; profiles across apps like ENS, Lens, Farcaster, and
          more.
        </p>
      </div>

      <CodeExample
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
    </>
  );
}
