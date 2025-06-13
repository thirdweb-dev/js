/**
 * Central entry point for analytics tracking helpers.
 *
 * This file re-exports individual event *categories* located under
 * `./track/*`.  Each category file in turn exposes small helper functions that
 * call PostHog with type-safe payloads.
 *
 * Example – reporting a contract deployment:
 * ```ts
 * import { reportContractDeployed } from "@/analytics/track";
 *
 * reportContractDeployed({
 *   address: "0x…",
 *   chainId: 1,
 * });
 * ```
 *
 * Adding a new event *category*:
 * 1. Create a new file under `./track/<category>.ts`.
 * 2. Inside that file, follow the pattern shown in `contract.ts` to define
 *    Zod schemas + `reportWhatever` helpers.
 * 3. Add a star-export below so the helpers are surfaced at the package root:
 *    ```ts
 *    export * from "./track/<category>";
 *    ```
 * 4. Consumers can now `import { reportMyEvent } from "@/analytics/track";`.
 */

export * from "./track/contract";
export * from "./track/token";
export * from "./track/nft";
export * from "./track/onboarding";
export * from "./track/marketplace";
