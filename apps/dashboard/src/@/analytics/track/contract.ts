/**
 * Contract-related analytics helpers.
 *
 * This file groups all PostHog events that belong to the "contract" domain
 * (e.g. contract deployment, upgrade, verification …).  Each event is a thin
 * wrapper around {@link __internal__reportEvent} that:
 *   1. Defines a Zod schema describing the payload that will be sent so we get
 *      runtime validation and static TypeScript inference for free.
 *   2. Exposes a `report<Something>` function that forwards the validated
 *      payload to PostHog.
 *
 * Usage – emitting this event:
 * ```ts
 * import { reportContractDeployed } from "@/analytics/track";
 *
 * reportContractDeployed({
 *   address: "0x…",
 *   chainId: 1,
 * });
 * ```
 *
 * Adding a new event:
 * 1. Add a new Zod schema that describes the event payload.
 * 2. Add a `reportContract<YourEvent>` function that takes
 *    `z.infer<typeof YourSchema>` as its single argument and calls
 *    `__internal__reportEvent("<your event name>", payload);`.
 * 3. (Optional) Document the event in the README if it should be consumed by
 *    other teams.
 */

import { isAddress } from "thirdweb";
import { z } from "zod/v4-mini";
import { __internal__reportEvent } from "./__internal";

const EVMAddressSchema = z.string().check(
  z.refine(isAddress, {
    message: "Invalid EVM address",
  }),
);

const EVMChainIdSchema = z.coerce.number().check(
  z.gte(1, {
    message: "Invalid chain ID",
  }),
);

const EVMContractSchema = z.object({
  address: EVMAddressSchema,
  chainId: EVMChainIdSchema,
});

export function reportContractDeployed(
  payload: z.infer<typeof EVMContractSchema>,
) {
  __internal__reportEvent("contract deployed", payload);
}
