import { redirect } from "next/navigation";

export function loginRedirect(path: string): never {
  redirect(`/login?next=${encodeURIComponent(path)}`);
}
