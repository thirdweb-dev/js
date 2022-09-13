import { isBrowser } from "../common/utils";
import { z } from "zod";

const JsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

type JsonLiteral = z.infer<typeof JsonLiteralSchema>;

const FileOrBufferUnionSchema = isBrowser()
  ? (z.instanceof(File) as z.ZodType<InstanceType<typeof File>>)
  : (z.instanceof(Buffer) as z.ZodTypeAny); // TODO: fix, this is a hack to make browser happy for now

export const FileOrBufferSchema = z.union([
  FileOrBufferUnionSchema,
  z.object({
    data: z.union([z.instanceof(Buffer), z.string()]),
    name: z.string(),
  }),
]);

export type FileOrBuffer = File | Buffer | BufferOrStringWithName;

type BufferOrStringWithName = {
  data: Buffer | string;
  name: string;
};

const JsonSchema: z.ZodType<Json> = z.lazy(() =>
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

export const UploadDataSchema = z.array(
  z.union([z.array(JsonObjectSchema), z.array(FileOrBufferSchema)], {
    invalid_type_error: "Must pass a file or buffer object or a JSON object.",
  }),
);

export type UploadData = JsonObject | FileOrBuffer;

export type CleanedUploadData = string | FileOrBuffer;
