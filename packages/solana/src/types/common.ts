import { isBrowser } from "../utils/context";
import { File } from "@web-std/file";
import { z } from "zod";

const fileOrBufferUnion = isBrowser()
  ? ([z.instanceof(File), z.string()] as [
      z.ZodType<InstanceType<typeof File>>,
      z.ZodString,
    ])
  : ([z.instanceof(Buffer), z.string()] as [
      z.ZodTypeAny, // @fixme, this is a hack to make browser happy for now
      z.ZodString,
    ]);

export const FileBufferOrStringSchema = z.union(fileOrBufferUnion);
export type FileBufferOrString = z.output<typeof FileBufferOrStringSchema>;

export const MAX_BPS = 10_000;
export const BasisPointsSchema = z
  .number()
  .max(MAX_BPS, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

export const PercentSchema = z
  .number()
  .max(100, "Cannot exeed 100%")
  .min(0, "Cannot be below 0%");

export const JsonLiteral = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const JsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([JsonLiteral, z.array(JsonSchema), z.record(JsonSchema)]),
);
export const JsonObjectSchema = z.record(JsonSchema);
export const HexColor = z.union([
  z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .transform((val) => val.replace("#", "")),
  z.string().length(0),
]);

/**
 * @internal
 */
export const OptionalPropertiesInput = z
  .union([z.array(JsonObjectSchema), JsonObjectSchema])
  .optional();

type JsonLiteral = boolean | null | number | string;
type JsonLiteralOrFileOrBuffer = JsonLiteral | FileOrBuffer;
export type Json = JsonLiteralOrFileOrBuffer | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };
export type BufferOrStringWithName = {
  data: Buffer | string;
  name?: string;
};
export type FileOrBuffer = Buffer | BufferOrStringWithName;
