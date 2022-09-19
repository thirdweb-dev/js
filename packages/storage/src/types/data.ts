import { z } from "zod";

const JsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

type JsonLiteral = z.infer<typeof JsonLiteralSchema>;

const isBrowser = () => typeof window !== "undefined";
const FileOrBufferUnionSchema = isBrowser()
  ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
  : (z.instanceof(Buffer) as z.ZodTypeAny); // @fixme, this is a hack to make browser happy for now

/**
 * @internal
 */
export const FileOrBufferSchema = z.union([
  FileOrBufferUnionSchema,
  z.object({
    data: FileOrBufferUnionSchema,
    name: z.string(),
  }),
]);

/**
 * @internal
 */
export const FileOrBufferOrStringSchema = z.union([
  FileOrBufferSchema,
  z.string(),
]);

/**
 * @internal
 */
export type FileOrBuffer = File | Buffer | BufferOrStringWithName;

/**
 * @internal
 */
export type BufferOrStringWithName = {
  data: Buffer | string;
  name: string;
};

/**
 * @internal
 */
export type FileOrBufferOrString = FileOrBuffer | string;

/**
 * @internal
 */
export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    JsonLiteralSchema,
    JsonObjectSchema,
    FileOrBufferSchema,
    z.array(JsonSchema),
  ]),
);

/**
 * @internal
 */
export const JsonObjectSchema = z.record(z.string(), JsonSchema);

/**
 * @internal
 */
export type Json = JsonLiteral | FileOrBuffer | JsonObject | Json[];

/**
 * @internal
 */
export type JsonObject = { [key: string]: Json };
