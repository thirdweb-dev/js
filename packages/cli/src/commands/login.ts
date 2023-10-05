import { Command } from "@commander-js/extra-typings";
import { loginUser } from "../auth";

export const login = new Command("login")
  .description("🔓 Login to thirdweb")
  .action(async () => {
    await loginUser(undefined, true);
  });
