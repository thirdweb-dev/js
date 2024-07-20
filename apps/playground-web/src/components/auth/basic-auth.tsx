import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { AuthButton } from "./auth-button";

export function BasicAuthPreview() {
  const jwt = cookies().get("jwt");
  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto">
        <AuthButton />
      </div>
      {jwt && !!jwt.value && (
        <table className="table-auto rounded-lg backdrop-blur border-collapse">
          <tbody>
            {Object.keys(jwt).map((key) => (
              <tr key={key} className="">
                <td className="border p-2 rounded">{key}</td>
                <td
                  className={`border p-2 max-w-[250px] max-h-[200px] overflow-y-auto break-words whitespace-normal ${
                    key === "value" ? "text-xs" : ""
                  }`}
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
