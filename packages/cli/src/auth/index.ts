import chalk from "chalk";
import prompts from "prompts";
import Cache, { CacheEntry } from "sync-disk-cache";
import { ApiResponse } from "../lib/types";
import os from "os";

export async function loginUser(
  cache: Cache,
  options?: { new: boolean },
  showLogs?: boolean,
) {
  const keyFound = getSession(cache);
  if (keyFound && !options?.new) {
    if (showLogs) {
      console.log(chalk.green("You are already logged in"));
    }
    return keyFound;
  } else {
    const apiKey = await createSession(cache);
    return apiKey;
  }
}

export async function logoutUser(cache: Cache) {
  try {
    cache.remove("api-secret-key");
    console.log(chalk.green("You have been logged out"));
  } catch (error) {
    console.log(chalk.red("Something went wrong", error));
  }
}

export function getSession(cache: Cache) {
  try {
    const apiKey: CacheEntry = cache.get("api-secret-key");
    return apiKey.value;
  } catch (error) {
    console.log(error);
  }
}

export async function createSession(cache: Cache) {
  try {
    const isWindows = os.type() === "Windows_NT";
    if (isWindows) {
      console.log(chalk.yellow("Windows detected: if you are using powershell, there are some known issues with it that we are actively working on, please use git bash or the command prompt. Thank you for your understanding."));
    }
    const response = await prompts({
      type: "invisible",
      name: "apiSecretKey",
      message: `Please enter your API secret key, you can find or create it on ${chalk.blue(
        "https://thirdweb.com/create-api-key",
      )}`,
    });

    const keyPassed = response.apiSecretKey;
    if (!keyPassed) {
      console.log(chalk.red("You need to pass an API secret key"));
      process.exit(1);
    }

    if (keyPassed.length === 32) {
      console.log(chalk.red(`This is not a valid secret key. To get your secret key
1. Create an API key at https://thirdweb.com/create-api-key 
2. Store and copy your Secret Key. This will be shown only once.
3. Paste it in the CLI when prompted`));
      process.exit(1);
    }

    try {
      await validateKey(response.apiSecretKey);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
    cache.set("api-secret-key", response.apiSecretKey);
    return response.apiSecretKey;
  } catch (error) {
    console.log(error);
  }
}

export async function validateKey(apiSecretKey: string) {
  const fetch = (await import("node-fetch")).default;
  // TODO: CHANGE THIS TO PROD BEFORE MERGING!!!
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
