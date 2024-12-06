import { Sponsorship } from "@/components/engine/gasless/Sponsorship";
import ThirdwebProvider from "@/components/thirdweb-provider";
import { EngineAPIHeader } from "../../../components/blocks/EngineAPIHeader";
// TODO: Get updated banner image and description.
export default function Page() {
  return (
    <ThirdwebProvider>
      <main className="container px-0 pb-20">
        <EngineAPIHeader
          title="Webhooks"
          description={
            <>
              Configure webhooks in Engine to notify your backend server of
              transaction or backend wallet events.
            </>
          }
          docsLink="https://portal.thirdweb.com/engine/features/webhooks?utm_source=playground"
          heroLink="/webhooks.avif"
        />

        <section>
          <Webhooks />
        </section>
      </main>
    </ThirdwebProvider>
  );
}

function Webhooks() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
          Webhooks
        </h2>
        <p className="max-w-[600px]">
          Configure webhooks in Engine to notify your backend server of
          transaction or backend wallet events.
        </p>
      </div>
      <Sponsorship />
    </>
  );
}
