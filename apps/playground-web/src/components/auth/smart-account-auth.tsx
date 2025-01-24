import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { cn } from "../../lib/utils";
import { SmartAccountAuthButton } from "./smart-account-auth-button";

export async function SmartAccountAuthPreview() {
  const jwt = (await cookies()).get("jwt");
  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto">
        <SmartAccountAuthButton />
      </div>
      {jwt && !!jwt.value && (
        <table className="table-auto border-collapse rounded-lg backdrop-blur">
          <tbody>
            {Object.keys(jwt).map((key) => (
              <tr key={key} className="">
                <td className="rounded border p-2">{key}</td>
                <td
                  className={cn(
                    "max-h-[200px] max-w-[250px] overflow-y-auto whitespace-normal break-words border p-2",
                    {
                      "text-xs": key === "value",
                    },
                  )}
                >
                  {jwt[key as keyof RequestCookie]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
