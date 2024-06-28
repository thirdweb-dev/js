import { CheckIcon } from "lucide-react";
import Image from "next/image";
import headerImage from "../assets/header.png";
import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";

export default function Page() {
  return (
    <div className="flex flex-col w-full px-4 py-10">
      <header className="flex flex-col gap-2 mb-10">
        <h2 className="text-4xl font-bold text-foreground">
          Create an Ecosystem
        </h2>
        <p className="text-secondary-foreground">
          Create wallets that work across every chain and every app.
        </p>
      </header>
      <main className="grid max-w-lg gap-8 lg:max-w-4xl xl:gap-12 lg:grid-cols-2">
        <section className="flex items-start">
          <div className="overflow-hidden border shadow rounded-xl bg-card">
            <Image src={headerImage} alt="" sizes="50vw" className="w-full" />
            <div className="p-6 pb-12 border-t">
              <h4 className="text-4xl font-bold text-foreground">
                $250{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  per month
                </span>
              </h4>
              <ul className="flex flex-col mt-6 space-y-4 text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 mt-1 text-green-500" /> Share
                  assets across apps within your ecosystem
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 mt-1 text-green-500" /> Connect
                  with social, phone, email, or passkey
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 mt-1 text-green-500" /> A
                  standalone wallet UI for all your users
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 mt-1 text-green-500" /> Custom
                  permissions and billing across your ecosystem
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="px-4 mb-12">
          <CreateEcosystemForm />
        </section>
      </main>
    </div>
  );
}
