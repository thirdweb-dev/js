import { CheckIcon } from "lucide-react";
import Image from "next/image";
import headerImage from "../assets/header.png";
import { CreateEcosystemForm } from "./components/client/create-ecosystem-form.client";

export default function Page() {
  return (
    <div className="w-full px-2 py-10 space-y-10 sm:px-4">
      <header className="space-y-2">
        <h2 className="text-4xl font-bold text-foreground">
          Create an Ecosystem
        </h2>
        <p className="text-secondary-foreground">
          Create wallets that work across every chain and every app.
        </p>
      </header>
      <main className="grid w-full max-w-sm gap-8 md:max-w-lg lg:max-w-4xl xl:gap-12 lg:grid-cols-2">
        <section className="flex items-start">
          <div className="overflow-hidden border shadow rounded-xl bg-card">
            <Image src={headerImage} alt="" sizes="50vw" className="w-full" />
            <div className="p-4 pb-8 border-t md:p-6 md:pb-12">
              <h4 className="text-4xl font-bold text-foreground">
                $250{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  per month
                </span>
              </h4>
              <ul className="flex flex-col mt-6 space-y-4 text-sm md:text-base text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500 md:mt-1" /> Share
                  assets across apps within your ecosystem
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500 md:mt-1" />{" "}
                  Connect with social, phone, email, or passkey
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500 md:mt-1" /> A
                  standalone wallet UI for all your users
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500 md:mt-1" />{" "}
                  Custom permissions and billing across your ecosystem
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="mb-12 lg:px-4">
          <CreateEcosystemForm />
        </section>
      </main>
    </div>
  );
}
