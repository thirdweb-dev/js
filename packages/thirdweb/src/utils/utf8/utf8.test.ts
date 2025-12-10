import { describe, expect, it } from "vitest";
import { isUTF8JSONString, parseUTF8String } from "./utf8.js";

describe("isUTF8JSONString", () => {
  it("should return true for valid UTF-8 JSON string", () => {
    const input = 'data:application/json;utf-8,{"test":"value"}';
    const result = isUTF8JSONString(input);
    expect(result).toBe(true);
  });

  it("should return true for UTF-8 JSON string with special text", () => {
    const input = 'data:application/json;utf-8,{"text":"Hello World!"}';
    const result = isUTF8JSONString(input);
    expect(result).toBe(true);
  });

  it("should return false for plain string without prefix", () => {
    const input = "Hello world";
    const result = isUTF8JSONString(input);
    expect(result).toBe(false);
  });

  it("should return false for base64 JSON string", () => {
    const input = "data:application/json;base64,eyJ0ZXN0IjoidmFsdWUifQ==";
    const result = isUTF8JSONString(input);
    expect(result).toBe(false);
  });

  it("should return false for different data type with utf-8", () => {
    const input = "data:text/plain;utf-8,Hello world";
    const result = isUTF8JSONString(input);
    expect(result).toBe(false);
  });

  it("should return false for empty string", () => {
    const input = "";
    const result = isUTF8JSONString(input);
    expect(result).toBe(false);
  });

  it("should return false for string with similar but wrong prefix", () => {
    const input = "data:application/json;utf8,{}";
    const result = isUTF8JSONString(input);
    expect(result).toBe(false);
  });
});

describe("parseUTF8String", () => {
  it("should parse UTF-8 string and return the JSON portion", () => {
    const input = 'data:application/json;utf-8,{"test":"value"}';
    const result = parseUTF8String(input);
    expect(result).toBe('{"test":"value"}');
  });

  it("should parse UTF-8 string with URL-encoded unicode characters", () => {
    const input =
      "data:application/json;utf-8,%7B%22name%22%3A%22test%22%2C%22value%22%3A123%7D";
    const result = parseUTF8String(input);
    expect(result).toBe('{"name":"test","value":123}');
  });

  it("should parse UTF-8 string with special characters", () => {
    const input =
      'data:application/json;utf-8,{"text":"Hello, World!","special":"@#$%"}';
    const result = parseUTF8String(input);
    expect(result).toBe('{"text":"Hello, World!","special":"@#$%"}');
  });

  it("should parse UTF-8 string with nested JSON", () => {
    const input =
      'data:application/json;utf-8,{"outer":{"inner":"value"},"array":[1,2,3]}';
    const result = parseUTF8String(input);
    expect(result).toBe('{"outer":{"inner":"value"},"array":[1,2,3]}');
  });

  it("should parse UTF-8 string with empty JSON object", () => {
    const input = "data:application/json;utf-8,{}";
    const result = parseUTF8String(input);
    expect(result).toBe("{}");
  });

  it("should parse UTF-8 string with commas in the JSON value", () => {
    const input = 'data:application/json;utf-8,{"list":"a,b,c"}';
    const result = parseUTF8String(input);
    expect(result).toBe('{"list":"a,b,c"}');
  });

  it("should handle URL-encoded characters", () => {
    const input = 'data:application/json;utf-8,{"url":"https://example.com"}';
    const result = parseUTF8String(input);
    expect(result).toBe('{"url":"https://example.com"}');
  });
});
