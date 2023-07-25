import { z } from "zod";
import { ChainInfoInputSchema } from "../ChainInfoInputSchema";

export type ChainInfo = z.infer<typeof ChainInfoInputSchema>;
