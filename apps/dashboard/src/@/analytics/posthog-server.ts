import "server-only";
import { unstable_cache } from "next/cache";
import { PostHog } from "posthog-node";

let _posthogClient: PostHog | null = null;

function getPostHogServer(): PostHog | null {
  if (!_posthogClient && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    _posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: "https://us.i.posthog.com",
    });
  }
  return _posthogClient;
}

/**
 * Check if a feature flag is enabled for a specific user
 * @param flagKey - The feature flag key
 * @param userEmail - The user's email address for filtering
 */
export const isFeatureFlagEnabled = unstable_cache(
  async (params: {
    flagKey: string;
    accountId: string;
    email: string | undefined;
  }): Promise<boolean> => {
    const posthogClient = getPostHogServer();
    if (!posthogClient) {
      console.warn("Posthog client not set");
      return true;
    }

    const { flagKey, accountId, email } = params;

    try {
      if (posthogClient && accountId) {
        const isEnabled = await posthogClient.isFeatureEnabled(
          flagKey,
          accountId,
          {
            personProperties: email ? { email } : undefined,
          },
        );
        if (isEnabled !== undefined) {
          return isEnabled;
        }
      }
    } catch (error) {
      console.error(`Error checking feature flag ${flagKey}:`, error);
    }
    return false;
  },
  ["is-feature-flag-enabled"],
  {
    revalidate: 3600, // 1 hour
  },
);
