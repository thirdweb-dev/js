import { ChainInfoInputSchema } from "./ChainInfoInputSchema";
import { defaultChains } from "@thirdweb-dev/chains";
import { z } from "zod";

/**
 * @public
 */
export const SDKOptionsSchema = /* @__PURE__ */ (() =>
  z
    .object({
      // @ts-expect-error - zod doesn't know anything about readonly
      supportedChains: z.array(ChainInfoInputSchema).default(defaultChains),
      clientId: z.string().optional(),
      secretKey: z.string().optional(),
      readonlySettings: z
        .object({
          rpcUrl: z.string().url(),
          chainId: z.number().optional(),
        })
        .optional(),
      gasSettings: z
        .object({
          maxPriceInGwei: z
            .number()
            .min(1, "gas price cannot be less than 1")
            .default(300),
          speed: z.enum(["standard", "fast", "fastest"]).default("fastest"),
        })
        .default({ maxPriceInGwei: 300, speed: "fastest" }),
      gasless: z
        .union([
          z.object({
            openzeppelin: z.object({
              relayerUrl: z.string().url(),
              relayerForwarderAddress: z.string().optional(),
              useEOAForwarder: z.boolean().default(false),
              domainName: z.string().default("GSNv2 Forwarder"),
              domainVersion: z.string().default("0.0.1"),
            }),
            experimentalChainlessSupport: z.boolean().default(false),
          }),
          z.object({
            biconomy: z.object({
              apiId: z.string(),
              apiKey: z.string(),
              deadlineSeconds: z
                .number()
                .min(1, "deadlineSeconds cannot be les than 1")
                .default(3600),
            }),
          }),
          z.object({
            engine: z.object({
              relayerUrl: z
                .string()
                .url()
                .transform((url) => url.replace(/\/$/, "")),
              relayerForwarderAddress: z.string().optional(),
              domainName: z.string().default("GSNv2 Forwarder"),
              domainVersion: z.string().default("0.0.1"),
              domainSeparatorVersion: z.string().default("1"),
            }),
            experimentalChainlessSupport: z.boolean().default(false),
          }),
        ])
        .optional(),
      gatewayUrls: z.array(z.string()).optional(),
      rpcBatchSettings: z
        .object({
          sizeLimit: z.number().default(200),
          timeLimit: z.number().default(10),
        })
        .optional(),
    })
    .default({
      gasSettings: { maxPriceInGwei: 300, speed: "fastest" },
    }))();

/**
 * @public
 * All these configuration options are optional with sane defaults:
 * @example
 * ```javascript
 * {
 *   readonlySettings: {
 *     rpcUrl, // force read calls to go through your own RPC url
 *     chainId, // reduce RPC calls by sepcifying your chain ID
 *   },
 *   gasSettings: {
 *     maxPriceInGwei, // Maximum gas price for transactions (default 300 gwei)
 *     speed, // the tx speed setting: 'standard'|'fast|'fastest' (default: 'fastest')
 *   },
 *   gasless: {
 *     // By specifying a gasless configuration - all transactions will get forwarded to enable gasless transactions
 *     openzeppelin: {
 *       relayerUrl, // your OZ Defender relayer URL
 *       relayerForwarderAddress, // the OZ defender relayer address (defaults to the standard one)
 *     },
 *     biconomy: {
 *       apiId, // your Biconomy API Id
 *       apiKey, // your Biconomy API Key
 *       deadlineSeconds, // your Biconomy timeout preference
 *     },
 *   },
 * }
 * ```
 */
export type SDKOptions = z.input<typeof SDKOptionsSchema>;
/**
 * @internal
 */
export type SDKOptionsOutput = z.output<typeof SDKOptionsSchema>;
/**
 * @public
 */
