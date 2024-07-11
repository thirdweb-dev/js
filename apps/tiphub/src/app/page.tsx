import { ArrowRightIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { redirect } from "next/navigation";

export default function HomePage() {
  return (
    <form
      className="flex flex-row gap-2"
      action={async (formData: FormData) => {
        "use server";
        redirect(`/${formData.get("repo")}`);
      }}
    >
      <Input
        className=""
        placeholder="org/repo"
        name="repo"
        required
        pattern=".*/.*"
      />
      <Button type="submit" size="icon" className="flex-shrink-0">
        <ArrowRightIcon />
      </Button>
    </form>
  );
}
