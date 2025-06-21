import posthog from "posthog-js";

// ----------------------------
// FEEDBACK
// ----------------------------

/**
 * ### Why do we need to report this event?
 * - To track the ratio of positive and negative feedback
 * - To record the feedback for future improvements of the documentation
 *
 * ### Who is responsible for this event?
 * @jnsdls
 *
 */
export function reportFeedback(
  properties: { helpful: true } | { helpful: false; feedback: string },
) {
  posthog.capture("documentation feedback submitted", properties);
}
