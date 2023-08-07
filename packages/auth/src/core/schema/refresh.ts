import { z } from "zod";
import { THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS } from "../../constants";

export const RefreshOptionsSchema = z.object({
  expirationTime: z
    .date()
    .default(
      () =>
        new Date(
          Date.now() + 1000 * THIRDWEB_AUTH_DEFAULT_TOKEN_DURATION_IN_SECONDS,
        ),
    ),
});

export type RefreshOptions = z.input<typeof RefreshOptionsSchema>;
