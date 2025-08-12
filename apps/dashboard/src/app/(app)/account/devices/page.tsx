import { getValidAccount } from "@/api/account/get-account";
import { AccountDevicesPage } from "./AccountDevicesPage";

export default async function Page() {
  // enforce valid account
  await getValidAccount("/account/devices");

  return (
    <div>
      <header className="border-border border-b py-10">
        <div className="container max-w-[950px]">
          <h1 className="font-semibold text-3xl tracking-tight">Devices</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            List of authorized devices that can perform actions on behalf of
            your account.
          </p>
        </div>
      </header>

      <div className="container max-w-[950px] py-8">
        <AccountDevicesPage />
      </div>
    </div>
  );
}
