import chalk from "chalk";
import prompts from "prompts";
import Cache, { CacheEntry } from "sync-disk-cache";
import { ApiResponse } from "../lib/types";

export async function loginUser(cache: Cache, options?: { new: boolean }) {
  const keyFound = getSession(cache);
  if (keyFound && !options?.new) {
    return keyFound;
  } else {
    const apiSecretKey = await createSession(cache);
    return apiSecretKey;
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
    const secretKey = await prompts({
      type: "text",
      name: "secretKey",
      message: `Please enter your API secret key, you can find or create it on ${chalk.blue("https://thirdweb.com/settings/api-keys")}`,
    });

    try {
      await validateKey(secretKey.secretKey);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
    cache.set("api-secret-key", secretKey.secretKey);
    return secretKey.secretKey;
  } catch (error) {
    console.log(error);
  }
}

export async function validateKey(apiKey: string) {
  let regex = /(sk)\.([a-z0-9])\w+/;
  const valid = regex.test(apiKey);
  if (!valid) {
    throw new Error(chalk.red("Invalid API secret key"));
  }
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`https://api.thirdweb.com/v1/keys/use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      scope: "bundler",
    }),
  });

  const apiResponse = (await response.json()) as ApiResponse;

  if (!response.ok) {
    const { error } = apiResponse;
    throw new Error(chalk.red(error.message));
  } else {
    return apiKey;
  }
}
