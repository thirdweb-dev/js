import { CodeExample } from "@/components/code/code-example";
import { LinkAccount, LinkedAccounts } from "./profiles";

export function Profiles() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-xl tracking-tight sm:text-2xl">
          View Linked Profiles
        </h2>
        <p className="max-w-[600px]">
          View all web2 and web3 linked profiles for a user along with specific
          details for each profile type, including name, email, profile picture
          and more.
        </p>
      </div>

      <CodeExample
        preview={<LinkedAccounts />}
        code={`import { useProfiles } from "thirdweb/react";
  
          function App() {
            const { data: profiles } = useProfiles({
              client,
            });
  
            return (
  <div>
    {profiles?.map((profile) => (
      <div key={profile.type}>
        <ProfileCard profile={profile} />
      </div>
    ))}
  </div>
  );
  };`}
        lang="tsx"
      />

      <div className="space-y-2">
        <h2 className="font-semibold text-xl tracking-tight sm:text-2xl">
          Link another profile
        </h2>
        <p className="max-w-[600px]">
          Link a web2 or web3 profile to the connected account.
          <br />
          You can do this with hooks like shown here or from the prebuilt
          connect UI.
        </p>
      </div>

      <CodeExample
        preview={<LinkAccount />}
        code={`import { useLinkProfile } from "thirdweb/react";
  
          function App() {
            const { mutate: linkProfile, isPending, error } = useLinkProfile();

            const linkMetamask = () => {
              // link any external wallet
              linkProfile({
                client: THIRDWEB_CLIENT,
                strategy: "wallet",
                wallet: createWallet("io.metamask"), // or any other wallet
                chain: baseSepolia,
              });
            };

            const linkPasskey = () => {
              // link any web2 identity provider
              linkProfile({
                client: THIRDWEB_CLIENT,
                strategy: "passkey", // or "email", "phone", etc.
                type: "sign-up",
              });
            };
  
            return (
  <div>
      <button onClick={linkMetamask}>
        Link Metamask
      </button>
      <button onClick={linkPasskey}>
        Link Passkey
      </button>
  </div>
  );
  };`}
        lang="tsx"
      />
    </>
  );
}
