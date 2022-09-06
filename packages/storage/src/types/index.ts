import { z } from "zod";

export type BufferOrStringWithName = {
  data: Buffer | string;
  name?: string;
};

export type FileOrBuffer = File | Buffer | BufferOrStringWithName;

type JsonLiteral = boolean | null | number | string;
type JsonLiteralOrFileOrBuffer = JsonLiteral | FileOrBuffer;
export type Json = JsonLiteralOrFileOrBuffer | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };

export const isBrowser = () => typeof window !== "undefined";

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

export type StorageOptions = {
  appendGatewayUrl: boolean;
};
