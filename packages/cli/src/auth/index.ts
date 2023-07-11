import chalk from "chalk";
import prompts from "prompts";
import { CacheEntry } from "../core/types/cache";

export async function loginUser(cache: any, options?: { new: boolean }) {
  const keyFound = getSession(cache);
  if (keyFound && !options?.new) {
    return keyFound;
  } else {
    const apiKey = await createSession(cache);
    return apiKey;
  }
}

export function getSession(cache: any) {
  try {
    const apiKey: CacheEntry = cache.get("api-key");
    return apiKey.value;
  } catch (error) {
    console.log(error);
  }
}

export async function createSession(cache: any) {
  try {
    const apiKey = await prompts({
      type: "text",
      name: "apiKey",
      message: "Please enter your API key, you can find it on https://thirdweb.com/settings/api-keys",
    });

    checkSyntaxOfKey(apiKey.apiKey);
    cache.set("api-key", apiKey.apiKey);
    return apiKey.apiKey;
  } catch (error) {
    console.log(error);
  }
}

export function checkSyntaxOfKey(apiKey: string) {
  let regex = /(pk|sk)\.([a-z0-9])\w+/;
  const valid = regex.test(apiKey);
  if (!valid) {
    throw new Error(chalk.red("Invalid API key"));
  }

  return apiKey;
}
