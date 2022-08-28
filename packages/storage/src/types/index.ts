export type BufferOrStringWithName = {
  data: Buffer | string;
  name?: string;
};

export type FileOrBuffer = File | Buffer | BufferOrStringWithName;

type JsonLiteral = boolean | null | number | string;
type JsonLiteralOrFileOrBuffer = JsonLiteral | FileOrBuffer;
export type Json = JsonLiteralOrFileOrBuffer | JsonObject | Json[];
export type JsonObject = { [key: string]: Json };
