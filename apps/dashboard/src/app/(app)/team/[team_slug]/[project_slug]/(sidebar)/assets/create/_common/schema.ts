import { isAddress } from "thirdweb";
import * as z from "zod";

const urlSchema = z.string().url();

export const socialUrlsSchema = z.array(
  z.object({
    platform: z.string(),
    url: z.string().refine(
      (val) => {
        if (val === "") {
          return true;
        }

        const url = val.startsWith("http") ? val : `https://${val}`;
        return urlSchema.safeParse(url).success;
      },
      {
        message: "Invalid URL",
      },
    ),
  }),
);

export const addressSchema = z.string().refine(
  (value) => {
    if (isAddress(value)) {
      return true;
    }
    return false;
  },
  {
    message: "Invalid address",
  },
);
