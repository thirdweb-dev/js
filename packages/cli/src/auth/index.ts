import { LocalWallet } from "@thirdweb-dev/wallets";
import assert from "assert";
import chalk from "chalk";
import crypto from "crypto";
import fs from "fs";
import http from "http";
import open from "open";
import ora from "ora";
import prompts from "prompts";
import url from "url";
import { logger } from "../core/helpers/logger";
import { ApiResponse } from "../lib/types";

export async function loginUser(
  credsConfigPath: string,
  options?: { new: boolean },
  showLogs?: boolean,
) {
  const creds = getSession(credsConfigPath);
  if (creds.token && !options?.new) {
    if (showLogs) {
      console.log(chalk.green("You are already logged in"));
    }
    return creds.token;
  } else {
    // const apiKey = await createSession(credsConfigPath);
    // return apiKey;
    if (showLogs) {
      console.log(
        chalk.yellow(
          "We did not find a session, please connect your wallet through our dashboard to continue",
        ),
      );
    }
    const apiKey = await startServer({ browser: true }, credsConfigPath);
    if (!apiKey) {
      throw new Error("Failed to login");
    }
    return apiKey;
  }
}

export async function logoutUser(credsConfigPath: string) {
  try {
    const dirExists = fs.existsSync(credsConfigPath);
    if (!dirExists) {
      return;
    }
    const configJson = fs.readFileSync(credsConfigPath, "utf-8");
    const parsedJson = JSON.parse(configJson);
    parsedJson.password = "";
    fs.writeFileSync(credsConfigPath, JSON.stringify(parsedJson), "utf-8");
    console.log(chalk.green("You have been logged out"));
  } catch (error) { 
    console.log(chalk.red("Something went wrong", error));
  }
}

export function getSession(credsConfigPath: string) {
  try {
    const fileExists = fs.existsSync(credsConfigPath);
    if (!fileExists) {
      return;
    }
    const configFile = fs.readFileSync(credsConfigPath, "utf8");
    const parsedConfig = JSON.parse(configFile);
    return parsedConfig;
  } catch (error) {
    console.log(error);
  }
}

export async function createSession(credsConfigPath: string) {
  try {
    const response = await prompts({
      type: "text",
      name: "apiSecretKey",
      message: `Please enter your API secret key, you can find or create it on ${chalk.blue(
        "https://thirdweb.com/dashboard/settings/api-keys",
      )}`,
    });

    try {
      await validateKey(response.apiSecretKey);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
    fs.writeFileSync(credsConfigPath, JSON.stringify({
      token: response.apiSecretKey,
      password: ""
    }), {
      encoding: "utf8",
      mode: 0o600,
    });
    return response.apiSecretKey;
  } catch (error) {
    console.log(error);
  }
}

export async function validateKey(apiSecretKey: string) {
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(
    `https://api.thirdweb.com/v1/keys/use?scope=storage`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": apiSecretKey,
      },
    },
  );

  const apiResponse = (await response.json()) as ApiResponse;

  if (!response.ok) {
    const { error } = apiResponse;
    throw new Error(chalk.red(error.message));
  } else {
    return apiSecretKey;
  }
}

type LoginProps = {
  browser: boolean;
};

function generateStateParameter(length: number) {
  return crypto.randomBytes(length).toString("hex");
}

export const startServer = async (
  props: LoginProps = { browser: true },
  credsConfigPath: string,
) => {
  const wallet = generateLocalWallet(credsConfigPath);
  const ourState = generateStateParameter(32);
  const urlToOpen =
    // `https://thirdweb.com/cli/login?from=cli&#${ourState}`;
    // `https://thirdweb-www-git-mariano-api-keys-sign-in.thirdweb-preview.com/cli/login?from=cli&#${ourState}`;
    `http://localhost:3000/cli/login?from=cli&#${ourState}`;

  let server: http.Server;
  let loginTimeoutHandle: NodeJS.Timeout;
  const timerPromise = new Promise<void>((resolve, reject) => {
    loginTimeoutHandle = setTimeout(() => {
      logger.error("Timed out waiting for secretKey, please try again.");
      server.close();
      clearTimeout(loginTimeoutHandle);
      reject(new Error("Timed out waiting for secretKey"));
    }, 120000);
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
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Methods", "GET");

      assert(req.url, "This request doesn't have a URL");
      const { pathname, query } = url.parse(req.url, true);
      switch (pathname) {
        case "/auth/callback": {
          if (query.id) {
            const secretKey = Array.isArray(query.id) ? query.id[0] : query.id;
            const theirState = Array.isArray(query.state)
              ? query.state[0]
              : query.state;
            if (theirState !== ourState) {
              res.writeHead(400, { "Content-Type": "text/plain" }); // send a 400 response
              res.end("Unauthorized request, state mismatch", () => {
                finish(new Error("Unauthorized request, state mismatch"));
              });
              reject(
                new Error(chalk.red("Unauthorized request, state mismatch")),
              );
            } else {
              fs.writeFileSync(credsConfigPath, JSON.stringify({

              }), {
                encoding: "utf8",
                mode: 0o600,
              });
              res.end(() => {
                finish();
              });
              logger.info(chalk.green(`Successfully logged in.`));
              resolve(secretKey); // resolve promise with secretKey
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" }); // send a 400 response
            res.end("No secretKey received", () => {
              finish(new Error("No secretKey received"));
            });
            reject(new Error(chalk.red("No secretKey received")));
          }
        }
      }
    });

    server.listen(8976);
  });
  if (props?.browser) {
    ora(`Opening a link in your default browser: ${urlToOpen}\n`).start();
    // Adding this timeout since it feels weird for the browser to open before the spinner.
    setTimeout(async () => {
      await open(urlToOpen);
    }, 2000);
  } else {
    logger.info(`Visit this link to authenticate: ${urlToOpen}`);
  }

  return Promise.race([timerPromise, loginPromise]);
};

async function promptAndSavePassword(credsConfigPath: string) {
  const response = await prompts({
    type: "invisible",
    name: "password",
    message: `Please enter a password to authenticate with the CLI`,
  });

  const fileExists = fs.existsSync(credsConfigPath);
  if (!fileExists) {
    return;
  }
  const configJson = fs.readFileSync(credsConfigPath, "utf-8");
  const parsedJson = JSON.parse(configJson);

  fs.writeFileSync(credsConfigPath, JSON.stringify({
    ...parsedJson,
    password: response.password
  }), "utf-8");

  return response.password;
}

async function generateLocalWallet(configCredsPath: string) {
  const wallet = new LocalWallet();
  await wallet.generate();
  const password = promptAndSavePassword(configCredsPath);
  await wallet.save({
    strategy: "encryptedJson",
    password: "password",
  });
}
