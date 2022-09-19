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

export const FileOrBufferSchema = z.union([
  FileOrBufferUnionSchema,
  z.object({
    data: FileOrBufferUnionSchema,
    name: z.string(),
  }),
]);

export const FileOrBufferOrStringSchema = z.union([
  FileOrBufferSchema,
  z.string(),
]);

export type FileOrBuffer = File | Buffer | BufferOrStringWithName;

export type BufferOrStringWithName = {
  data: Buffer | string;
  name: string;
};

export type FileOrBufferOrString = FileOrBuffer | string;

export const JsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    JsonLiteralSchema,
    JsonObjectSchema,
    FileOrBufferSchema,
    z.array(JsonSchema),
  ]),
);

export const JsonObjectSchema = z.record(z.string(), JsonSchema);

export type Json = JsonLiteral | FileOrBuffer | JsonObject | Json[];

export type JsonObject = { [key: string]: Json };
