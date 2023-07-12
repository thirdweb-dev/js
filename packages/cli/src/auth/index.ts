import chalk from "chalk";
import prompts from "prompts";
import Cache, { CacheEntry } from "sync-disk-cache";
import { ApiResponse } from "../lib/types";

export async function loginUser(cache: Cache, options?: { new: boolean }) {
  const keyFound = getSession(cache);
  if (keyFound && !options?.new) {
    console.log(chalk.green("You are already logged in"));
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
    const response = await prompts({
      type: "text",
      name: "apiSecretKey",
      message: `Please enter your API secret key, you can find or create it on ${chalk.blue("https://thirdweb.com/dashboard/settings")}`,
    });

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
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`https://api.thirdweb.com/v1/keys/use`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": apiSecretKey,
    },
    body: JSON.stringify({
      scope: "storage",
    }),
  });

  const apiResponse = (await response.json()) as ApiResponse;

  if (!response.ok) {
    const { error } = apiResponse;
    throw new Error(chalk.red(error.message));
  } else {
    return apiSecretKey;
  }
}
