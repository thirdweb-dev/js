import { LocalWallet } from "@thirdweb-dev/wallets";
import assert from "assert";
import chalk from "chalk";
import fs from "fs";
import http from "http";
import open from "open";
import ora from "ora";
import prompts from "prompts";
import url from "url";
import { logger } from "../core/helpers/logger";
import { ThirdwebAuth } from "@thirdweb-dev/auth";
import { ICredsConfig } from "../lib/types";
import { generateStateParameter } from "../lib/utils";

type LoginProps = {
  browser: boolean;
  configPaths: ConfigPaths;
};

const defaultLoginProps = {
  browser: true,
  configPaths: {
    credsConfigPath: "",
    cliWalletPath: "",
    tokenPath: "",
  },
};

type ConfigPaths = {
  credsConfigPath: string;
  cliWalletPath: string;
  tokenPath: string;
}

export async function loginUser(
  configPaths: ConfigPaths,
  options?: { new: boolean },
  showLogs?: boolean,
) {
  const { credsConfigPath, cliWalletPath, tokenPath } = configPaths;
  const authToken = await getSession(tokenPath, credsConfigPath);
  if (authToken && !options?.new) {
    if (showLogs) {
      console.log(chalk.green("You are already logged in"));
    }
    // @ts-ignore
    globalThis["AUTH_TOKEN"] = authToken;
    return authToken;
  } else {
    if (showLogs) {
      console.log(
        chalk.yellow(
          "We did not find a session, please connect your wallet through our dashboard to continue",
        ),
      );
    }
    await getOrGenerateLocalWallet(credsConfigPath, cliWalletPath);
    const authToken = await authenticateUser({ browser: true, configPaths });
    if (!authToken) {
      throw new Error("Failed to login");
    }

    // @ts-ignore
    globalThis["AUTH_TOKEN"] = authToken;
    return authToken;
  }
}

export async function logoutUser(credsConfigPath: string) {
  try {
    ora("Logging out...").start();
    const dirExists = fs.existsSync(credsConfigPath);
    if (!dirExists) {
      ora().warn(chalk.yellow("You are already logged out, did you mean to login?"));
      return;
    }
    fs.unlinkSync(credsConfigPath);
    ora().succeed(chalk.green("You have been logged out"));
  } catch (error) {
    console.log(chalk.red("Something went wrong", error));
  }
}

export async function getSession(tokenPath: string, configCredsPath: string) {
  if (!fs.existsSync(tokenPath) || !fs.existsSync(configCredsPath)) {
    return null;
  }

  try {
    await checkPasswordExpiration(configCredsPath);
    return fs.readFileSync(tokenPath, "utf8");
  } catch (error) {
    console.log(error);
  }
}

export const authenticateUser = async (
  props: LoginProps = defaultLoginProps,
) => {
  const { credsConfigPath, cliWalletPath, tokenPath } = props.configPaths;

  // Get or generate a localwallet.
  const wallet = await getOrGenerateLocalWallet(credsConfigPath, cliWalletPath);
  const walletAddress = await wallet.getAddress();
  const auth = new ThirdwebAuth(wallet, "localhost:3000");

  // Generate the login payload to pass to the dashboard.
  const loggedIn = await auth.login({
    domain: "localhost:3000",
    address: walletAddress,
  });

  // In this case the state is the loggedIn object.
  const ourState = generateStateParameter(32);
  const payload = encodeURIComponent(JSON.stringify(loggedIn));
  const urlToOpen =
    // `https://thirdweb.com/cli/login?from=cli&#${ourState}`;
    // `https://thirdweb-www-git-mariano-api-keys-sign-in.thirdweb-preview.com/cli/login?from=cli&#${ourState}`;
    `http://localhost:3000/cli/login?payload=${payload}&#${ourState}`;

  let server: http.Server;
  let loginTimeoutHandle: NodeJS.Timeout;
  const timerPromise = new Promise<void>((resolve, reject) => {
    loginTimeoutHandle = setTimeout(() => {
      logger.error("Login session timed out, server didn't receive a response in 2 minutes. Please try again.");
      server.close();
      clearTimeout(loginTimeoutHandle);
      reject(new Error("Login session timed out, server didn't receive a response in 2 minutes. Please try again."));
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
          if (query.token) {
            const token = Array.isArray(query.token) ? query.token[0] : query.token;
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
            } else {
              // Save the token to the config file.
              fs.writeFileSync(tokenPath, token), {
                encoding: "utf8",
                mode: 0o600,
              };
              res.end(() => {
                finish();
              });
              logger.info(chalk.green(`\nSuccessfully logged in.`));
              resolve(token); // resolve promise with secretKey
            }
          } else {
            res.writeHead(400, { "Content-Type": "text/plain" }); // send a 400 response
            res.end("No authToken received", () => {
              finish(new Error("No authToken received"));
            });
            reject(new Error(chalk.red("\nNo authToken received")));
          }
        }
      }
    });

    server.listen(8976);
  });
  if (props?.browser) {
    console.log(`Opening a link in your default browser: ${urlToOpen}`);
    console.log(chalk.yellow("\nAwaiting response from the dashboard..."));
    // Adding this timeout since it feels weird for the browser to open before the spinner.
    setTimeout(async () => {
      await open(urlToOpen);
    }, 2000);
  } else {
    logger.info(`Visit this link to authenticate: ${urlToOpen}`);
  }

  return Promise.race([timerPromise, loginPromise]);
};

async function getOrCreatePassword(configCredsPath: string): Promise<string> {
  const newExpiration = new Date(Date.now()).getTime() + 1000 * 60 * 60 * 2; // 2 days
  // Check if the password exists, if not, prompt for it.
  if (!fs.existsSync(configCredsPath)) {
    const response = await prompts({
      type: "invisible",
      name: "password",
      message: `Please enter a password to start a session with the CLI, this password will be needed to login again in the future, make sure to remember it!`,
    });

    if (!response.password) {
      throw new Error("No password provided");
    }

    fs.writeFileSync(configCredsPath, JSON.stringify({
      password: response.password,
      expiration: newExpiration,
    }), "utf-8");

    return response.password as string;
  }

  return await checkPasswordExpiration(configCredsPath);
}

async function getOrGenerateLocalWallet(configCredsPath: string, cliWalletPath: string) {
  // Get or prompt for password.
  let password = await getOrCreatePassword(configCredsPath);
  const wallet = new LocalWallet();

  if (fs.existsSync(cliWalletPath)) {
    const walletJson = fs.readFileSync(cliWalletPath, "utf8");

    await wallet.import({
      encryptedJson: walletJson,
      password: password,
    });
    return wallet;
  }

  // Otherwise, generate a new wallet.
  wallet.generate();
  const walletExported = await wallet.export({
    strategy: "encryptedJson",
    password,
  });

  fs.writeFileSync(cliWalletPath, walletExported, {
    encoding: "utf8",
    mode: 0o600,
  });

  return wallet;
}

const checkPasswordExpiration = async (credsConfigPath: string) => {
  const newExpiration = new Date(Date.now()).getTime() + 1000 * 60 * 60 * 2; // 2 days
  const configJson = JSON.parse(fs.readFileSync(credsConfigPath, "utf-8")) as ICredsConfig;
  const { password, expiration } = configJson;

  // Check if the password has expired.
  if (Date.now() > expiration) {
    // If it has, prompt for it again.
    const response = await prompts({
      type: "invisible",
      name: "password",
      message: `Session has expired, please confirm your password to continue`,
    });

    // Check that input is not empty.
    if (!response.password) {
      throw new Error("No password provided");
    }

    // Check if the password matches.
    if (response.password !== password) {
      throw new Error("Incorrect password, if you forgot your password, please logout and login again.");
    }

    // Reset the expiration date.
    fs.writeFileSync(credsConfigPath, JSON.stringify({
      ...configJson,
      expiration: newExpiration,
    }), "utf-8");
  } else {
    // We will want to extend the expiration date by 2 hours.
    fs.writeFileSync(credsConfigPath, JSON.stringify({
      ...configJson,
      expiration: expiration + 1000 * 60 * 60 * 2, // 2 hours.
    }), "utf-8");
  }

  return password;
};

export const validateToken = async (token: string) => {
  const auth = new ThirdwebAuth(new LocalWallet(), "localhost:3000");
  try {
    const { payload } = auth.parseToken(token);
    // Authenticate the token to get the address of the user.
    const authBody = await auth.authenticate(token, {
      issuerAddress: payload.iss,
    })
    console.log(authBody.address);
  } catch (error) {
    throw new Error(chalk.red("Unauthorized token"));
  }
};

export const validateKey = async (apiSecretKey: string) => {
  try {
    const response = await fetch(`https://api.thirdweb.com/v1/keys/use?scope=storage`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": apiSecretKey,
      }
    })

    if (response.status !== 200) {
      throw new Error("Unauthorized key");
    }

  } catch (error) {
    throw new Error(chalk.red("Unauthorized key"));
  }
};