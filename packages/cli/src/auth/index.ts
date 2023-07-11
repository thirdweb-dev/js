import chalk from "chalk";
import prompts from "prompts";
import Cache, { CacheEntry } from "sync-disk-cache";

export async function loginUser(cache: Cache, options?: { new: boolean }) {
  const keyFound = getSession(cache);
  if (keyFound && !options?.new) {
    return keyFound;
  } else {
    const apiKey = await createSession(cache);
    return apiKey;
  }
}

export async function logoutUser(cache: Cache) {
  try {
    cache.remove("api-key");
    console.log(chalk.green("You have been logged out"));
  } catch (error) {
    console.log(chalk.red("Something went wrong", error));
  }
}

export function getSession(cache: Cache) {
  try {
    const apiKey: CacheEntry = cache.get("api-key");
    return apiKey.value;
  } catch (error) {
    console.log(error);
  }
}

export async function createSession(cache: Cache) {
  try {
    const apiKey = await prompts({
      type: "text",
      name: "apiKey",
      message: `Please enter your API key, you can find or create it on ${chalk.blue("https://thirdweb.com/settings/api-keys")}`,
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
