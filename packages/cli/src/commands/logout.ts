import { Command } from "@commander-js/extra-typings";
import { logoutUser } from "../auth";

export const logout = new Command("logout")
  .description("🚪 Logout from thirdweb")
  .action(async () => {
    await logoutUser();
  });
