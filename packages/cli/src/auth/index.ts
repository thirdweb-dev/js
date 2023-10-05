import { LocalWallet } from "@thirdweb-dev/wallets";
import assert from "node:assert";
import chalk from "chalk";
import { existsSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import http from "node:http";
import open from "open";
import ora from "ora";
import url from "node:url";
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import crypto from "node:crypto";
import { logger, spinner } from "../legacy/core/helpers/logger";
import { ICredsConfig } from "../legacy/lib/types";
import { generateStateParameter } from "../legacy/lib/utils";
import path from "node:path";
import { configDir } from "../utils/filesystem";

const credsConfigPath = path.join(configDir, "creds.json");
const cliWalletPath = path.join(configDir, "wallet.json");
const tokenPath = path.join(configDir, "auth-token.txt");

export async function loginUser(
  options?: { new: boolean },
  showLogs?: boolean,
) {
  const authToken = await getSession();
  if (authToken && !options?.new) {
    if (showLogs) {
      console.log(chalk.green("You are already logged in"));
    }
    globalThis["TW_CLI_AUTH_TOKEN"] = authToken;
    return authToken;
  } else {
    const token = await authenticateUser();
    if (!token) {
      throw new Error("Failed to login");
    }

    globalThis["TW_CLI_AUTH_TOKEN"] = token;
    return token;
  }
}

export async function logoutUser() {
  try {
    ora("Logging out...").start();
    const dirExists =
      existsSync(credsConfigPath) &&
      existsSync(tokenPath) &&
      existsSync(cliWalletPath);
    if (!dirExists) {
      ora().warn(
        chalk.yellow("You are already logged out, did you mean to login?"),
      );
      return;
    }
    await unlink(credsConfigPath);
    await unlink(tokenPath);
    // TODO: We can consider not removing this on logout later, once we want to implement teams. For now this wallet will be ephemeral.
    await unlink(cliWalletPath);
    ora().succeed(chalk.green("You have been logged out"));
  } catch (error) {
    console.log(chalk.red("Something went wrong", error));
  }
}

export async function getSession() {
  if (!existsSync(tokenPath) || !existsSync(credsConfigPath)) {
    return null;
  }
  try {
    return await readFile(tokenPath, "utf8");
  } catch (error) {
    console.error(error);
  }
}

export const authenticateUser = async () => {
  const waitForDashboard = spinner(
    "Waiting for a response from the dashboard",
  ).clear();

  // Get or generate a localwallet.
  const wallet = await getOrGenerateLocalWallet();
  const walletAddress = await wallet.getAddress();
  const domain = "thirdweb.com";
  const auth = new ThirdwebAuth(wallet, domain);

  // Generate the login payload to pass to the dashboard.
  const loggedIn = await auth.login({
    domain: domain,
    address: walletAddress,
  });

  // In this case the state is the loggedIn object.
  const ourState = generateStateParameter(32);
  const payload = encodeURIComponent(JSON.stringify(loggedIn));
  const urlToOpen = `https://thirdweb.com/cli/login?payload=${payload}&#${ourState}`;

  let server: http.Server;
  let loginTimeoutHandle: NodeJS.Timeout;
  const timerPromise = new Promise<void>((resolve, reject) => {
    loginTimeoutHandle = setTimeout(() => {
      logger.error(
        "Login session timed out, server didn't receive a response in 5 minutes. Please try again.",
      );
      server.close();
      clearTimeout(loginTimeoutHandle);
      reject(
        new Error(
          "Login session timed out, server didn't receive a response in 5 minutes. Please try again.",
        ),
      );
    }, 300000);
  });

  const loginPromise = new Promise<string>((resolve, reject) => {
    server = http.createServer(async (req, res) => {
      function finish(error?: Error) {
        clearTimeout(loginTimeoutHandle);
        server.close((closeErr?: Error) => {
          if (error || closeErr) {
            reject(error || closeErr);
          }
        });
      }
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Origin", "https://thirdweb.com");
      res.setHeader("Access-Control-Allow-Methods", "POST");

      if (req.method === "OPTIONS") {
        res.setHeader(
          "Access-Control-Allow-Headers",
          "content-type, baggage, sentry-trace",
        );
        res.writeHead(200);
        res.end();
        return;
      }

      assert(req.url, "This request doesn't have a URL");
      const { pathname, query } = url.parse(req.url, true);
      switch (pathname) {
        case "/auth/callback": {
          if (query.failed) {
            res.writeHead(500, "Unable to authenticate with the dashboard!");
            res.end("Unable to authenticate with the dashboard!", () => {
              finish(new Error("Unable to authenticate with the dashboard!"));
            });
            reject(
              chalk.red(
                "Something went wrong! Unable to authenticate with the dashboard.",
              ),
            );
            waitForDashboard.stop();
          }
          if (query.token) {
            const token = Array.isArray(query.token)
              ? query.token[0]
              : query.token;
            const theirState = Array.isArray(query.state)
              ? query.state[0]
              : query.state;

            // Check if the state sent back is the same as the one we sent.
            if (theirState !== ourState) {
              res.writeHead(400, { "Content-Type": "text/plain" }); // send a 400 response
              res.end("Unauthorized request, state mismatch", () => {
                finish(new Error("Unauthorized request, state mismatch"));
              });
              reject(
                new Error(chalk.red("\nUnauthorized request, state mismatch")),
              );
              waitForDashboard.stop();
            } else {
              // Save the token to the config file.
              // eslint-disable-next-line no-unused-expressions
              await writeFile(tokenPath, token),
                {
                  encoding: "utf8",
                  mode: 0o600,
                };
              res.end(() => {
                waitForDashboard.clear();
                console.log(
                  chalk.green(
                    `Successfully linked your account to this device`,
                  ),
                );
                finish();
              });
              logger.info(chalk.green(`\nSuccessfully logged in.`));
              resolve(token); // resolve promise with secretKey
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("No authToken received", () => {
              finish(new Error("No authToken received"));
            });
            reject(new Error(chalk.red("\nNo authToken received")));
            waitForDashboard.stop();
          }
        }
      }
    });

    server.listen(8976);
  });
  console.log(
    `Automatically attempting to open a link to authenticate with our dashboard...\n`,
  );
  waitForDashboard.start();
  // Adding this timeout since it feels weird for the browser to open before the spinner.
  setTimeout(async () => {
    await open(urlToOpen);
  }, 2000);

  console.log(
    chalk.yellow(
      `If the browser doesn't open, please use this link to authenticate:\n`,
    ),
  );
  console.log(chalk.yellow(urlToOpen + "\n"));

  return Promise.race([timerPromise, loginPromise]);
};

async function getOrCreatePassword(): Promise<string> {
  const passwordFileExists = existsSync(credsConfigPath);
  if (!passwordFileExists) {
    // Generate a random password for the CLI to be able to import / export the wallet.
    return crypto.randomUUID();
  } else {
    const file = await readFile(credsConfigPath, "utf8");
    try {
      JSON.parse(file);
    } catch (e) {
      // If it fails to parse the password we should just delete the file and generate a new password, since this password is not shown to the user.
      await unlink(credsConfigPath);
      return getOrCreatePassword();
    }
    const { password } = JSON.parse(file) as ICredsConfig;
    return password;
  }
}

async function getOrGenerateLocalWallet() {
  // Get or prompt for password.
  const password = await getOrCreatePassword();
  const wallet = new LocalWallet();
  const foundWallet = existsSync(cliWalletPath);

  if (foundWallet) {
    const walletJson = await readFile(cliWalletPath, "utf8");
    try {
      // See if file is valid before proceeding.
      JSON.parse(walletJson);

      await wallet.import({
        encryptedJson: walletJson,
        password,
      });
      return wallet;
    } catch (e) {
      // Wallet file is not valid json, create a new one.
    }
  }

  // Otherwise, generate a new wallet.
  wallet.generate();
  const walletExported = await wallet.export({
    strategy: "encryptedJson",
    password,
  });

  // write wallet
  await writeFile(cliWalletPath, walletExported, {
    encoding: "utf8",
    mode: 0o600,
  });

  // write password
  await writeFile(
    credsConfigPath,
    JSON.stringify({
      password: password,
    }),
    "utf8",
  );

  return wallet;
}

export const validateKey = async (apiSecretKey: string) => {
  const apiUrl = "https://api.thirdweb.com/v1/keys/use";
  try {
    const response = await fetch(`${apiUrl}?scope=storage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": apiSecretKey,
      },
    });

    if (response.status !== 200) {
      throw new Error("Unauthorized key");
    }
  } catch (error) {
    throw new Error(chalk.red("Unauthorized key"));
  }
};

export async function ensureAuth(secretKey?: string) {
  if (secretKey) {
    // this throws if secret key is not valid
    await validateKey(secretKey);
    return secretKey;
  }
  // this throws if login fails
  await loginUser();
  // no secret key
  return "";
}
