import "server-only";
import { PostHog } from "posthog-node";

let posthogServer: PostHog | null = null;

function getPostHogServer(): PostHog | null {
  if (!posthogServer && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthogServer = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: "https://us.i.posthog.com",
    });
  }
  return posthogServer;
}

/**
 * Check if a feature flag is enabled for a specific user
 * @param flagKey - The feature flag key
 * @param userEmail - The user's email address for filtering
 */
export async function isFeatureFlagEnabled(
  flagKey: string,
  userEmail?: string,
): Promise<boolean> {
  try {
    const client = getPostHogServer();
    if (client && userEmail) {
      const isEnabled = await client.isFeatureEnabled(flagKey, userEmail, {
        personProperties: {
          email: userEmail,
        },
      });
      if (isEnabled !== undefined) {
        return isEnabled;
      }
    }
  } catch (error) {
    console.error(`Error checking feature flag ${flagKey}:`, error);
  }
  return false;
}
