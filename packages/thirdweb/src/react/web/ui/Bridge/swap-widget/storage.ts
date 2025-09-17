import { z } from "zod";

const tokenSelectionSchema = z.object({
  tokenAddress: z.string().min(1),
  chainId: z.number().int().positive(),
});

const lastUsedTokensSchema = z.object({
  buyToken: tokenSelectionSchema.optional(),
  sellToken: tokenSelectionSchema.optional(),
});

type LastUsedTokens = z.infer<typeof lastUsedTokensSchema>;

const STORAGE_KEY = "tw.swap.lastUsedTokens";

function isBrowser() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getLastUsedTokens(): LastUsedTokens | undefined {
  if (!isBrowser()) {
    return undefined;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw);
    const result = lastUsedTokensSchema.safeParse(parsed);
    if (!result.success) {
      return undefined;
    }
    return result.data;
  } catch {
    return undefined;
  }
}

export function setLastUsedTokens(update: LastUsedTokens): void {
  if (!isBrowser()) {
    return;
  }
  try {
    const result = lastUsedTokensSchema.safeParse(update);
    if (!result.success) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
  } catch {
    // ignore write errors
  }
}
