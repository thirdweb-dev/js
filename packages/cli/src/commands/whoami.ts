import { Command } from "@commander-js/extra-typings";
import { getSession, loginUser } from "../auth";
import { logger } from "../utils/logger";
import prompts from "prompts";
import { getAccount } from "../auth/account";
import chalk from "chalk";

export const whoami = new Command("whoami")
  .description("🕵️  Retrieve your account info and test your auth config")
  .option("-k, --key <key>", "API secret key to authorize usage")
  .action(async ({ key }) => {
    let token = "";
    const loginType = key ? "Secret Key" : "JWT (SIWE)";
    token = (await getSession()) || "";
    if (!token) {
      logger.info("You are not logged in.");
      const option = await prompts({
        type: "confirm",
        name: "login",
        message: "Would you like to login now?",
      });
      if (option.login) {
        token = await loginUser(undefined, true);
      }
    }
    // if we still don't have a token at this point, we can't continue
    if (!token && !key) {
      logger.info(
        "Cannot retrieve account info without being logged in, exiting.",
      );
      return process.exit(0);
    }
    try {
      const accountInfo = await getAccount({ token, secretKey: key });
      logger.log(`👋 You are logged in via ${chalk.green(loginType)}.`);
      logger.table([
        {
          "Account Wallet": chalk.bold(accountInfo.creatorWalletAddress),
          Email: accountInfo.email
            ? chalk.bold(accountInfo.email)
            : chalk.italic("not set"),
          Plan: chalk.bold(accountInfo.plan.toUpperCase()),
        },
      ]);
    } catch (e) {
      logger.error("failed to retrieve account information", e);
    }
  });
