import { redirect } from "next/navigation";

export function loginRedirect(path?: string): never {
  if (!path) {
    redirect("/login");
  }

  redirect(`/login?next=${encodeURIComponent(path)}`);
}
